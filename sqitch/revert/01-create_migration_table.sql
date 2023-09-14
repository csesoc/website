-- Revert website:01-create_migration_table from pg

BEGIN;

-- XXX Add DDLs here.
DROP TABLE IF EXISTS migrations CASCADE;

COMMIT;
