-- Revert website:03-create_groups_table from pg

BEGIN;

-- XXX Add DDLs here.
DROP TYPE IF EXISTS permissions_enum CASCADE;

DROP TABLE IF EXISTS groups CASCADE;
COMMIT;
