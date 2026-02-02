# GlobaLeaks Docker setup

To run GlobaLeaks using Docker
```bash
 docker run -d --name globaleaks \
  -p 80:80 -p 443:443 \
  -v globaleaks-data:/var/globaleaks \
  globaleaks/globaleaks:latest
