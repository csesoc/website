-- Revert website:02-create_frontend_table from pg

BEGIN;

-- XXX Add DDLs here.
DROP TABLE IF EXISTS frontend;

COMMIT;
