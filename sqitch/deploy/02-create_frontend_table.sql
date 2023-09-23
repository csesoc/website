-- Deploy website:02-create_frontend_table to pg
-- requires: 01-create_migration_table

BEGIN;

CREATE TABLE IF NOT EXISTS frontend (
  FrontendID  SERIAL PRIMARY KEY,
  FrontendURL VARCHAR(100)
);
-- XXX Add DDLs here.

COMMIT;
