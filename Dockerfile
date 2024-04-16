# Start from the official Jitsi web image
FROM jitsi/web

# Remove the default web files
RUN rm -rf /usr/share/jitsi-meet

# Copy your custom Jitsi Meet build
COPY . /usr/share/jitsi-meet
