# Handlers implementing platform wizard
from globaleaks.handlers.admin.tenant import wizard
from globaleaks.handlers.base import BaseHandler
from globaleaks.rest import requests


class Wizard(BaseHandler):
    """
    Setup Wizard handler
    """
    check_roles = 'any'
    invalidate_cache = True

    def post(self):
        request = self.validate_request(self.request.content.read(),
                                        requests.WizardDesc)

        if self.request.hostname not in self.state.tenant_hostname_id_map:
            hostname = self.request.hostname
        else:
            hostname = ''

        return wizard(self.request.tid, hostname, request)
