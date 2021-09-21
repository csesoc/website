CREATE EXTENSION hstore;
SET timezone = 'Australia/Sydney';

CREATE TABLE groups (
  UID   SERIAL PRIMARY KEY,
  Name  VARCHAR(50) NOT NULL,
  Permission int UNIQUE NOT NULL
  /* permission checks will check whether the permission level of user's group is higher than the clearance check */
);
INSERT INTO groups (Name, Permission)
  VALUES ('admin', 900);
INSERT INTO groups (name, Permission)
  VALUES ('user', 500);


DROP TABLE IF EXISTS person;
CREATE TABLE person (
  UID serial PRIMARY KEY,
  Email VARCHAR(50) UNIQUE NOT NULL,
  First_name VARCHAR(50) NOT NULL,
  Password VARCHAR(50) NOT NULL,
  isOfGroup int,

  CONSTRAINT fk_AccessLevel FOREIGN KEY (isOfGroup)
    REFERENCES groups(UID),

  /* non duplicate email and password constraints */
  CONSTRAINT no_dupes UNIQUE (Email, Password)
);

/* inserting two accounts into db */
INSERT INTO person (Email, First_name, Password, isOfGroup)
VALUES ('z0000000@ad.unsw.edu.au', 'adam', 'password', 1);
INSERT INTO person(Email, First_name, Password, isOfGroup)
VALUES ('john.smith@gmail.com', 'john', 'password', 2);
INSERT INTO person(Email, First_name, Password, isOfGroup)
VALUES ('jane.doe@gmail.com', 'jane', 'password', 2);
  

DROP TABLE IF EXISTS filesystem;
CREATE TABLE filesystem (
  EntityID      SERIAL PRIMARY KEY,
  LogicalName   VARCHAR(50) NOT NULL,
  
  IsDocument    BOOLEAN DEFAULT false,
  IsPublished   BOOLEAN DEFAULT false,
  CreatedAt     TIMESTAMP NOT NULL DEFAULT NOW(),

  OwnedBy       INT,
  Parent        INT REFERENCES filesystem(EntityID) DEFAULT NULL,
  Children      hstore DEFAULT NULL,

  /* FK Constraint */
  CONSTRAINT fk_owner FOREIGN KEY (OwnedBy) 
    REFERENCES groups(UID),
  /* Unique name constraint: there should not exist an entity of the same type with the
     same parent and logical name. */
  CONSTRAINT unique_name UNIQUE (Parent, LogicalName, IsDocument)        
);

/* Insert root directory and then add our constraints */
DO $$
DECLARE 
  randomGroup groups.UID%type;
  rootID      filesystem.EntityID%type;
BEGIN
  SELECT groups.UID INTO randomGroup FROM groups WHERE Name = 'admin'::VARCHAR;

  /* Insert the root directory */
  INSERT INTO filesystem (LogicalName, OwnedBy, Children)
    VALUES ('root', randomGroup, ''::hstore);
  SELECT filesystem.EntityID INTO rootID FROM filesystem WHERE LogicalName = 'root'::VARCHAR;

  /* insert "has parent" constraint*/
  EXECUTE 'ALTER TABLE filesystem 
    ADD CONSTRAINT has_parent CHECK (Parent IS NOT NULL OR EntityID = '||rootID||')';
  /* Assert that the entity isnt a document with directory properties
    or vice-versa*/                    
  EXECUTE 'ALTER TABLE filesystem
      ADD CONSTRAINT valid_entity CHECK ((IsDocument AND Children IS NULL) 
                                  OR (NOT IsDocument AND Children IS NOT NULL AND NOT IsPublished) OR EntityID = '||rootID||')';
END $$;


/* Utility procedure :) */
DROP FUNCTION IF EXISTS new_entity;
CREATE OR REPLACE FUNCTION new_entity (parentP INT, logicalNameP VARCHAR, ownedByP INT, isDocumentP BOOLEAN DEFAULT false) RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  newEntityID filesystem.EntityID%type;
  childSet hstore := NULL;
BEGIN
  /* If we are inserting a new directory just update the childset to an empty hstore instead */
  IF NOT isDocumentP THEN
    childSet := ''::hstore;
  END IF;

  WITH newEntity AS (
    INSERT INTO filesystem (LogicalName, IsDocument, OwnedBy, Parent, Children)
      VALUES (logicalNameP, isDocumentP, ownedByP, parentP, childSet)
      RETURNING EntityID
  )
  SELECT newEntity.EntityID INTO newEntityID FROM newEntity;

  UPDATE filesystem
    SET Children = Children || (newEntityID::TEXT || '=>"."')::hstore
  WHERE EntityID = parentP;

  RETURN newEntityID;
END $$;

/* Another utility procedure */
DROP FUNCTION IF EXISTS delete_entity;
CREATE OR REPLACE FUNCTION delete_entity (entityIDP INT) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  numKids INT := array_length(akeys((SELECT Children FROM filesystem WHERE EntityID = entityIDP)), 1);
  parentP INT := (SELECT Parent FROM filesystem WHERE EntityID = entityIDP);
  isRoot  BOOLEAN := (SELECT Parent FROM filesystem WHERE EntityID = entityIDP) IS NULL;
BEGIN
  /* If this is a directory and has kids raise an error */
  IF numKids > 0
  THEN
    RAISE EXCEPTION SQLSTATE '90001' USING MESSAGE = 'entity has children (please dont orphan them O_O )';
  END IF;

  IF isRoot THEN
    RAISE EXCEPTION SQLSTATE '90001' USING MESSAGE = 'stop trying to delete root >:(';
  END IF;

  DELETE FROM filesystem WHERE EntityID = entityIDP;
  UPDATE filesystem SET Children = Children - entityIDP::TEXT
  WHERE EntityID = parentP;
END $$;

/* Insert dummy data */
DO $$
DECLARE
  rootID        filesystem.EntityID%type;
  newEntity     filesystem.EntityID%type;
  wasPopping    filesystem.EntityID%type;
  oldEntity     filesystem.EntityID%type;
BEGIN
  SELECT filesystem.EntityID INTO rootID FROM filesystem WHERE Parent IS NULL;
  
  newEntity := (SELECT new_entity(rootID::INT, 'downloads'::VARCHAR, 1, false));
  oldEntity := (SELECT new_entity(rootID::INT, 'documents'::VARCHAR, 1, false));

  wasPopping := (SELECT new_entity(oldEntity::INT, 'cool_document'::VARCHAR, 1, true));
  wasPopping := (SELECT new_entity(oldEntity::INT, 'cool_document_round_2'::VARCHAR, 1, true));
  PERFORM delete_entity(wasPopping::INT);
  wasPopping := (SELECT new_entity(oldEntity::INT, 'cool_document_round_2'::VARCHAR, 1, true));
END $$;