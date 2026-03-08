#!/bin/sh
set -e
npm run typeorm:migrate-prod
exec "$@"
