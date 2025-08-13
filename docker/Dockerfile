# GlobaLeaks Unified Dockerfile
# Supports both production (remote) and testing (local) installs.
#
# Build Arguments:
#   BASE_IMAGE:     The base image for the OS (e.g., debian:trixie-slim@sha256:...)
#   DISTRIBUTION:   The target distribution codename (e.g., trixie)

ARG BASE_IMAGE=debian:trixie-slim@sha256:f2306da7a8fb6440535937baed0ce0018736742d6dc5beec9d6a31355b259726
ARG DISTRIBUTION=trixie

FROM ${BASE_IMAGE}

# Redeclare build arguments to make them available after FROM
ARG DISTRIBUTION=trixie

# Set environment for non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# Install basic dependencies common to all builds
RUN apt-get update -q && \
    apt-get dist-upgrade -y && \
    apt-get install -y wget lsb-release gnupg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy setup files
RUN mkdir /tmp/globaleaks-setup-files
COPY files/* /tmp/globaleaks-setup-files

# Download install script if missing
RUN if [ ! -f /tmp/globaleaks-setup-files/install.sh ]; then \
    cd /tmp/globaleaks-setup-files && \
    wget https://deb.globaleaks.org/install.sh; \
    fi

# Run the unified installation script
# The script automatically detects Docker environment and adapts its behavior
RUN chmod +x /tmp/globaleaks-setup-files/install.sh && \
    /tmp/globaleaks-setup-files/install.sh && \
    rm -rf /tmp/globaleaks-setup-files

EXPOSE 8080 8443

USER globaleaks

CMD ["/usr/bin/python3", "/usr/bin/globaleaks", "--working-path=/var/globaleaks/", "-n"]
