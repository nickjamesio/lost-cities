#!/bin/sh

echo "Waiting for postgres..."

while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

gunicorn --worker-class eventlet -w 1 -b 0.0.0.0:5000 "src:create_app()"
# gunicorn --log-level debug --access-logfile - --error-log - --worker-class eventlet -w 1 -b 0.0.0.0:5000 "src:create_app()"