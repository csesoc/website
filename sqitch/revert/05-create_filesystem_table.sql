-- Revert website:05-create_filesystem_table from pg

BEGIN;

-- XXX Add DDLs here.
DROP TABLE IF EXISTS metadata;
DROP TABLE IF EXISTS filesystem;
DROP FUNCTION IF EXISTS new_entity;
DROP FUNCTION IF EXISTS delete_entity;

COMMIT;
