-- Revert website:04-create_person_table from pg

BEGIN;

-- XXX Add DDLs here.
DROP TABLE IF EXISTS person;

DROP FUNCTION IF EXISTS create_normal_user;


COMMIT;
