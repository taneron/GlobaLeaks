# GlobaLeaks Unified Dockerfile
# Supports both production (remote) and testing (local) installs.
#
# Build Arguments:
#   BASE_IMAGE:     The base image for the OS (e.g., debian:trixie-slim@sha256:...)
#   DISTRIBUTION:   The target distribution codename (e.g., trixie)

ARG BASE_IMAGE=debian:trixie-slim@sha256:f2306da7a8fb6440535937baed0ce0018736742d6dc5beec9d6a31355b259726
ARG DISTRIBUTION=trixie

FROM ${BASE_IMAGE}

ADD https://deb.globaleaks.org/install.sh /tmp/install.sh

# Redeclare build arguments to make them available after FROM
ARG DISTRIBUTION=trixie

# Set environment for non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

COPY files/* /tmp/

RUN groupadd -r globaleaks --gid=1000 && useradd -r -d /var/globaleaks -g globaleaks --uid=1000 globaleaks

RUN apt-get update -q && \
    apt-get dist-upgrade -y && \
    apt-get install -y --no-install-recommends lsb-release && \
    chmod +x /tmp/install.sh && \
    /tmp/install.sh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/*

RUN mkdir -p /run/globaleaks && chown -R globaleaks:globaleaks /run/globaleaks

EXPOSE 8080 8443

USER globaleaks

CMD ["/usr/bin/python3", "/usr/bin/globaleaks", "--working-path=/var/globaleaks/", "-n"]
