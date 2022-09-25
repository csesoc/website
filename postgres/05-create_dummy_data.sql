/* Create default groups */
INSERT INTO groups (Name, Permission) VALUES ('adminA', 'delete');
INSERT INTO groups (name, Permission) VALUES ('userA', 'write');

/* create a god root node */
INSERT INTO frontend (FrontendID, FrontendLogicalName, FrontendURL) VALUES (uuid_nil(), 'God'::VARCHAR, ''::VARCHAR);

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
    VALUES (rootID, 'A', randomGroup, uuid_nil());

  /* insert "has parent" constraint */
  EXECUTE 'ALTER TABLE filesystem 
    ADD CONSTRAINT has_parent CHECK (Parent != NULL)';
END $$;


/* Insert dummy data */
DO $$
DECLARE
  rootID        filesystem.EntityID%type;
  newEntity     filesystem.EntityID%type;
  wasPopping    filesystem.EntityID%type;
  oldEntity     filesystem.EntityID%type;
BEGIN
  SELECT frontend.FrontendID INTO rootID FROM frontend WHERE FrontendLogicalName = 'A'::VARCHAR;
  
  newEntity := (SELECT new_entity(rootID, 'downloads'::VARCHAR, 1, false));
  oldEntity := (SELECT new_entity(rootID, 'documents'::VARCHAR, 1, false));

  wasPopping := (SELECT new_entity(oldEntity, 'cool_document'::VARCHAR, 1, true));
  wasPopping := (SELECT new_entity(oldEntity, 'cool_document_round_2'::VARCHAR, 1, true));
  PERFORM delete_entity(wasPopping);
  wasPopping := (SELECT new_entity(oldEntity, 'cool_document_round_2'::VARCHAR, 1, true));
END $$;


/* inserting three accounts into db */
DO LANGUAGE plpgsql $$
DECLARE
  rootID      filesystem.EntityID%type;
BEGIN
  SELECT frontend.FrontendID INTO rootID FROM frontend WHERE FrontendLogicalName = 'A'::VARCHAR;
  EXECUTE create_normal_user('z0000000@ad.unsw.edu.au', 'adam', 'password', rootID);
  EXECUTE create_normal_user('john.smith@gmail.com', 'john', 'password', rootID);
  EXECUTE create_normal_user('jane.doe@gmail.com', 'jane', 'password', rootID);
END $$;