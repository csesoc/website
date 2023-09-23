-- Deploy website:03-create_groups_table to pg
-- requires: 02-create_frontend_table

BEGIN;

-- XXX Add DDLs here.
CREATE EXTENSION IF NOT EXISTS hstore;
SET timezone = 'Australia/Sydney';

DROP TYPE IF EXISTS permissions_enum CASCADE;
CREATE TYPE permissions_enum as ENUM ('read', 'write', 'delete');

CREATE TABLE IF NOT EXISTS groups (
  UID   SERIAL PRIMARY KEY,
  Name  VARCHAR(50) NOT NULL,
  Permission permissions_enum UNIQUE NOT NULL
);

COMMIT;
