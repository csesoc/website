SET timezone = 'Australia/Sydney';

/* Create default groups */
INSERT INTO groups (Name, Permission) VALUES ('adminA', 'delete');
INSERT INTO groups (name, Permission) VALUES ('userA', 'write');

/* create a dummy frontend called A */
INSERT INTO frontend (FrontendLogicalName, FrontendURL) VALUES ('A'::VARCHAR, 'http://localhost:8080'::VARCHAR);

/* Setup FS table and modify constraints */
/* Insert root directory and then add our constraints */
DO $$
DECLARE 
  randomGroup groups.UID%type;
  rootID      filesystem.EntityID%type;
BEGIN
  SELECT frontend.FrontendID INTO rootID FROM frontend WHERE FrontendLogicalName = 'A'::VARCHAR;
  SELECT groups.UID INTO randomGroup FROM groups WHERE Name = 'adminA'::VARCHAR;
  /* Insert the root directory */
  INSERT INTO filesystem (EntityID, LogicalName, OwnedBy, Parent)
    VALUES (rootID, 'Folder0', randomGroup, uuid_nil());
  
  -- /* Set parent to uuid_nil() because postgres driver has issue supporting NULL values */
  -- UPDATE filesystem SET Parent = uuid_nil() WHERE EntityID = rootID;

  /* insert "has parent" constraint*/
  EXECUTE 'ALTER TABLE filesystem 
    ADD CONSTRAINT has_parent CHECK (Parent != NULL)';
END $$;


-- /* Insert dummy data */
-- DO $$
-- DECLARE
--   rootID        filesystem.EntityID%type;
--   newEntity     filesystem.EntityID%type;
--   wasPopping    filesystem.EntityID%type;
--   oldEntity     filesystem.EntityID%type;
-- BEGIN
--   SELECT frontend.FrontendID INTO rootID FROM frontend WHERE FrontendLogicalName = 'A'::VARCHAR;
  
--   newEntity := (SELECT new_entity(rootID, 'downloads'::VARCHAR, 1, false));
--   oldEntity := (SELECT new_entity(rootID, 'documents'::VARCHAR, 1, false));

--   wasPopping := (SELECT new_entity(oldEntity, 'cool_document'::VARCHAR, 1, true));
--   wasPopping := (SELECT new_entity(oldEntity, 'cool_document_round_2'::VARCHAR, 1, true));
--   PERFORM delete_entity(wasPopping);
--   wasPopping := (SELECT new_entity(oldEntity, 'cool_document_round_2'::VARCHAR, 1, true));
-- END $$;


-- /* inserting two accounts into db */
-- DO LANGUAGE plpgsql $$
-- BEGIN
--   EXECUTE create_normal_user('z0000000@ad.unsw.edu.au', 'adam', 'password', 1);
--   EXECUTE create_normal_user('john.smith@gmail.com', 'john', 'password', 1);
--   EXECUTE create_normal_user('jane.doe@gmail.com', 'jane', 'password', 1);
-- END $$;