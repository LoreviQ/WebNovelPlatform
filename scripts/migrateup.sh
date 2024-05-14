#!/bin/bash

if [ -f .env ]; then
    source .env
fi

cd sql/schema
goose turso $DB_CONNECTION_TURSO up
goose turso $DB_CONNECTION_TURSO_TEST up