#!/usr/bin/env sh
set -eu

envsubst '${CONSUMER_KEY}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"