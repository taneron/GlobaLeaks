import json
from datetime import timedelta
from twisted.internet import defer
from twisted.internet.threads import deferToThread

from globaleaks.db import sync_refresh_tenant_cache
from globaleaks.rest import errors
from globaleaks.rest.cache import Cache
from globaleaks.state import State
from globaleaks.utils.json import JSONEncoder
from globaleaks.utils.tempdict import TempDict
from globaleaks.utils.utility import datetime_now, deferred_sleep


USERS_ROLES = {'any', 'admin', 'analyst', 'custodian', 'receiver'}
BYPASS_PATHS = {b"/api/auth/token", b"/api/auth/type", b"/api/report"}

def has_session_or_token(self):
    return self.token or self.session


def decorator_rate_limit(f):
    # Decorator that enforces rate limiting on authenticated whistleblowers' sessions
    def wrapper(self, *args, **kwargs):
        if self.session and self.session.role == 'whistleblower':
            if self.request.path == b'/api/whistleblower/submission':
                root_tenant = State.tenants.get(1)
                if root_tenant:
                    State.RateLimitingTable.check(self.request.path + b'#' + str(self.request.tid).encode(),
                                                  root_tenant.cache.threshold_reports_per_hour)
                    State.RateLimitingTable.check(self.request.path + b'#' + self.request.client_ip.encode(),
                                                  root_tenant.cache.threshold_reports_per_hour_per_ip)

            now = datetime_now()
            if now > self.session.ratelimit_time + timedelta(seconds=1):
                self.session.ratelimit_time = now
                self.session.ratelimit_count = 0

            self.session.ratelimit_count += 1

            if self.session.ratelimit_count > 5:
                wait_time = self.session.ratelimit_count // 5
                d = deferred_sleep(wait_time)
                d.addCallback(lambda _: f(self, *args, **kwargs))
                return d
            else:
                return f(self, *args, **kwargs)

        return f(self, *args, **kwargs)

    return wrapper


def decorator_require_session_or_token(f):
    # Decorator that ensures a token or a session is included in the request
    def wrapper(self, *args, **kwargs):
        if self.request.path not in BYPASS_PATHS and not has_session_or_token(self):
            raise errors.InternalServerError("Invalid request: No token and no session")

        return f(self, *args, **kwargs)

    return wrapper


def decorator_authentication(f, roles):
    # Decorator that performs role checks on the user session
    def wrapper(self, *args, **kwargs):
        user_roles = set(roles)  # Convert roles to set
        if 'any' in user_roles:
            return f(self, *args, **kwargs)
        if self.session and self.session.tid == self.request.tid:
            if 'user' in user_roles and self.session.role in USERS_ROLES:
                return f(self, *args, **kwargs)
            if self.session.role in user_roles:
                return f(self, *args, **kwargs)

        raise errors.NotAuthenticated

    return wrapper


def decorator_cache_get(f):
    # Decorator that checks if the requests resource is cached
    def wrapper(self, *args, **kwargs):
        c = Cache.get(self.request.tid, self.request.path, self.request.language)
        if c is None:
            d = defer.maybeDeferred(f, self, *args, **kwargs)
            d.addCallback(lambda data: Cache.set(self.request.tid, self.request.path, self.request.language, b'application/json', json.dumps(data, cls=JSONEncoder))[1])
            return d
        self.request.setHeader(b'Content-type', c[0])
        return c[1]

    return wrapper


def decorator_cache_invalidate(f):
    def wrapper(self, *args, **kwargs):
        d = defer.maybeDeferred(f, self, *args, **kwargs)

        if self.invalidate_cache:
            def callback(result):
                Cache.invalidate(self.request.tid)
                deferToThread(sync_refresh_tenant_cache, self.request.tid)
                return result

            d.addCallback(callback)

        return d

    return wrapper


def decorate_method(h, method):
    roles = getattr(h, 'check_roles')
    if isinstance(roles, str):
        roles = {roles}

    f = getattr(h, method)

    if State.settings.enable_api_cache:
        if method == 'get':
            if h.cache_resource:
                f = decorator_cache_get(f)
        elif method in ['delete', 'post', 'put']:
            if h.invalidate_cache:
                f = decorator_cache_invalidate(f)

    if method in ['delete', 'post', 'put']:
        f = decorator_require_session_or_token(f)
        f = decorator_rate_limit(f)

    f = decorator_authentication(f, roles)

    setattr(h, method, f)
