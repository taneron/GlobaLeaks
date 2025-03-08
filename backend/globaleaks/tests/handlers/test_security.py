import re
from twisted.internet.defer import inlineCallbacks
from globaleaks.handlers import security
from globaleaks.tests import helpers

class TestSecuritytxtHandler(helpers.TestHandler):
    _handler = security.SecuritytxtHandler

    @inlineCallbacks
    def test_get(self):
        # Get the actual response
        result = yield self.request().get()

        # Remove the Expires line using regex (ensure the full line is removed)
        result_without_expiry = re.sub(r"Expires:.*\n?.*", "", result)

        expected_data_without_expiry = (
            "Policy: https://github.com/globaleaks/globaleaks-whistleblowing-software/security/policy\n"
            "Contact: https://github.com/globaleaks/globaleaks-whistleblowing-software/security/advisories/new\n"
        )

        self.assertEqual(result_without_expiry, expected_data_without_expiry)
