#!/bin/sh

echo "Waiting for postgres..."

while ! nc -z lostcities_db 5432; do
  echo "Sleeping. Will check back in 100ms"
  sleep 0.1
done

echo "PostgreSQL started"

# run with threads so websockets work
python manage.py run --host=0.0.0.0