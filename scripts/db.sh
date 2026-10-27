#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PGDATA="$DIR/pgdata"
PORT=5433

case "$1" in
  start)
    if ss -tuln | grep -q ":$PORT "; then
      echo "PostgreSQL is already running on port $PORT."
    else
      echo "Starting PostgreSQL on port $PORT..."
      /usr/lib/postgresql/16/bin/pg_ctl -D "$PGDATA" -o "-p $PORT -k /tmp" -l "$PGDATA/logfile" start
      echo "PostgreSQL started on port $PORT."
    fi
    ;;
  stop)
    echo "Stopping PostgreSQL on port $PORT..."
    /usr/lib/postgresql/16/bin/pg_ctl -D "$PGDATA" stop || true
    ;;
  status)
    /usr/lib/postgresql/16/bin/pg_ctl -D "$PGDATA" status || true
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
    ;;
esac
