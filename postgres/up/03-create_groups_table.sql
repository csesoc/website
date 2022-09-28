CREATE EXTENSION IF NOT EXISTS hstore;
SET timezone = 'Australia/Sydney';

CREATE TYPE permissions_enum as ENUM ('read', 'write', 'delete');

CREATE TABLE IF NOT EXISTS groups (
  UID   SERIAL PRIMARY KEY,
  Name  VARCHAR(50) NOT NULL,
  Permission permissions_enum UNIQUE NOT NULL
);