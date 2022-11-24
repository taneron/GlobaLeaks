# How to build and deploy changed client

Client consists of *index.html* and *scripts.min.js* which is located at `/usr/share/globaleaks/client` and `/usr/share/globaleaks/client/js`

1. Build your changed files using the command `grunt build` in the repositories directory named /client
2. Copy js files to any directory of your server `scp -r ./build/js admin@myserverip:/any/folder/adminuser/owns`
3. Now Copy files to the production folder in `/usr/share/globaleaks/client/js`
4. Restart Globaleaks and make sure it runs `/etc/init.d/globaleaks restart`


| [main](https://github.com/globaleaks/GlobaLeaks/tree/main) | [![Build Status](https://travis-ci.com/globaleaks/GlobaLeaks.svg?branch=main)](https://app.travis-ci.com/github/globaleaks/GlobaLeaks) | [![Codacy Badge](https://app.codacy.com/project/badge/Grade/c09f1ec9607f4546924d19798a98dd7d)](https://www.codacy.com/gh/globaleaks/GlobaLeaks/dashboard) | [![Codacy Badge](https://app.codacy.com/project/badge/Coverage/c09f1ec9607f4546924d19798a98dd7d)](https://www.codacy.com/gh/globaleaks/GlobaLeaks/dashboard) | [![Build Status](https://readthedocs.org/projects/globaleaks/badge/?version=main&style=flat)](https://docs.globaleaks.org/en/main/)cp
