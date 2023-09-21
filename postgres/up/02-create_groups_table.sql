CREATE EXTENSION IF NOT EXISTS hstore;
SET timezone = 'Australia/Sydney';

/* A group provides users with specific access permissions for certain entities */
DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
  GroupID       SERIAL PRIMARY KEY,
  Name          VARCHAR(50) NOT NULL
);
