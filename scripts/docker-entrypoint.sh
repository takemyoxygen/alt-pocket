#!/usr/bin/env sh
set -eu

envsubst '${APP_KEY}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"