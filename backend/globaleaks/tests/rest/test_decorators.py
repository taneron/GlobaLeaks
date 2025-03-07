from twisted.trial import unittest
from twisted.internet import defer
from unittest.mock import MagicMock, patch
from datetime import timedelta
from globaleaks.rest import errors
from globaleaks.state import State
from globaleaks.rest.cache import Cache
from globaleaks.utils.utility import datetime_now, deferred_sleep
from globaleaks.rest.decorators import (decorator_rate_limit, decorator_require_session_or_token,
                                        decorator_authentication, decorator_cache_get, decorator_cache_invalidate)


class FakeRequest:
    def __init__(self, tid=1, path=b"/test", client_ip=b"127.0.0.1", language="en"):
        self.tid = tid
        self.path = path
        self.client_ip = client_ip
        self.language = language  # Add this line
        self.responseHeaders = MagicMock()

    def setHeader(self, key, value):
        pass

class FakeSession:
    def __init__(self, role="user", tid=1, ratelimit_time=None, ratelimit_count=0):
        self.role = role
        self.tid = tid
        self.ratelimit_time = ratelimit_time or datetime_now()
        self.ratelimit_count = ratelimit_count

class TestDecorators(unittest.TestCase):
    def setUp(self):
        self.request = FakeRequest()
        self.session = FakeSession()
        self.token = None

    @patch("globaleaks.rest.decorators.deferred_sleep", return_value=defer.succeed(None))
    @defer.inlineCallbacks
    def test_decorator_rate_limit(self, mock_sleep):
        @decorator_rate_limit
        def test_func(self):
            return defer.succeed("Allowed")

        self.session.role = "whistleblower"

        # Simulate reaching rate limit 3 times in a row
        self.session.ratelimit_count = 0  # At the threshold

        # Simulate reaching rate limit 3 times in a row
        for _ in range(10):
            yield test_func(self)

        self.assertEqual(mock_sleep.call_count, 5)  # Should be called 3 times

        # Reset count and call again, should not trigger sleep
        self.session.ratelimit_count = 0
        yield test_func(self)
        self.assertEqual(mock_sleep.call_count, 5)  # Should still be 3 (no new sleeps)

    def test_decorator_require_session_or_token(self):
        @decorator_require_session_or_token
        def test_func(self):
            return "Authenticated"

        self.session = None
        self.request.token = None
        self.request.path = b"/forbidden"

        with self.assertRaises(errors.InternalServerError):
            test_func(self)

    def test_decorator_authentication(self):
        def test_func(self):
            return "Authorized"

        decorated_func = decorator_authentication(test_func, ["admin"])

        self.session.role = "user"
        with self.assertRaises(errors.NotAuthenticated):
            decorated_func(self)

        self.session.role = "admin"
        self.assertEqual(decorated_func(self), "Authorized")

    @defer.inlineCallbacks
    def test_decorator_cache_get(self):
        Cache.set(1, b"/test", "en", b"application/json", "cached_response")

        @decorator_cache_get
        def test_func(self):
            return defer.succeed({"message": "fresh_response"})

        result = yield test_func(self)
        self.assertEqual(result, "cached_response")

    @defer.inlineCallbacks
    def test_decorator_cache_invalidate(self):
        @decorator_cache_invalidate
        def test_func(self):
            return defer.succeed("Updated")

        self.invalidate_cache = True
        result = yield test_func(self)
        self.assertEqual(result, "Updated")

