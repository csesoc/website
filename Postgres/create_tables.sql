CREATE EXTENSION hstore;
SET timezone = 'Australia/Sydney';

CREATE TYPE permissions_enum as ENUM ('read', 'write', 'delete');

CREATE TABLE groups (
  UID   SERIAL PRIMARY KEY,
  Name  VARCHAR(50) NOT NULL,
  Permission permissions_enum UNIQUE NOT NULL
  /* permission checks will check whether the permission level of user's group is higher than the clearance check */
);
INSERT INTO groups (Name, Permission)
  VALUES ('admin', 'delete');
INSERT INTO groups (name, Permission)
  VALUES ('user', 'write');


DROP TABLE IF EXISTS person;
CREATE TABLE person (
  UID serial PRIMARY KEY,
  Email VARCHAR(50) UNIQUE NOT NULL,
  First_name VARCHAR(50) NOT NULL,
  Password CHAR(64) NOT NULL,
  isOfGroup INT,

  CONSTRAINT fk_AccessLevel FOREIGN KEY (isOfGroup)
    REFERENCES groups(UID),

  /* non duplicate email and password constraints */
  CONSTRAINT no_dupes UNIQUE (Email, Password)
);

/* create user function plpgsql */
DROP FUNCTION IF EXISTS create_normal_user;
CREATE OR REPLACE FUNCTION create_normal_user (email VARCHAR, name VARCHAR, password VARCHAR) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
BEGIN
  INSERT INTO person (Email, First_name, Password, isOfGroup)
  VALUES (email, name, encode(sha256(password::BYTEA), 'hex'), 2);
END $$;

/* inserting two accounts into db */
SELECT create_normal_user('z0000000@ad.unsw.edu.au', 'adam', 'password');
SELECT create_normal_user('john.smith@gmail.com', 'john', 'password');
SELECT create_normal_user('jane.doe@gmail.com', 'jane', 'password');


DROP TABLE IF EXISTS filesystem;
CREATE TABLE filesystem (
  EntityID      SERIAL PRIMARY KEY,
  LogicalName   VARCHAR(50) NOT NULL,
  
  IsDocument    BOOLEAN DEFAULT false,
  IsPublished   BOOLEAN DEFAULT false,
  CreatedAt     TIMESTAMP NOT NULL DEFAULT NOW(),

  OwnedBy       INT,
  /* Pain */
  Parent        INT REFERENCES filesystem(EntityID) DEFAULT 1,

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
  /* Root root :) */
  SELECT groups.UID INTO randomGroup FROM groups WHERE Name = 'admin'::VARCHAR;
  INSERT INTO filesystem (LogicalName, IsDocument, IsPublished, OwnedBy, Parent)
    VALUES ('rootroot', true, true, randomGroup, NULL);
  /* Insert the root directory */
  INSERT INTO filesystem (LogicalName, OwnedBy)
    VALUES ('root', randomGroup);
  SELECT filesystem.EntityID INTO rootID FROM filesystem WHERE LogicalName = 'root'::VARCHAR;

  /* insert "has parent" constraint*/
  EXECUTE 'ALTER TABLE filesystem 
    ADD CONSTRAINT has_parent CHECK (Parent != 1 OR EntityID = '||rootID||')';
END $$;


/* Utility procedure :) */
DROP FUNCTION IF EXISTS new_entity;
CREATE OR REPLACE FUNCTION new_entity (parentP INT, logicalNameP VARCHAR, ownedByP INT, isDocumentP BOOLEAN DEFAULT false) RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  newEntityID filesystem.EntityID%type;
  parentIsDocument BOOLEAN := (SELECT IsDocument FROM filesystem WHERE EntityID = parentP LIMIT 1);
BEGIN
  IF parentIsDocument THEN
    /* We shouldnt be delcaring that a document is our parent */
    RAISE EXCEPTION SQLSTATE '90001' USING MESSAGE = 'cannot make parent a document';
  END If;
  WITH newEntity AS (
    INSERT INTO filesystem (LogicalName, IsDocument, OwnedBy, Parent)
      VALUES (logicalNameP, isDocumentP, ownedByP, parentP)
      RETURNING EntityID
  )

  SELECT newEntity.EntityID INTO newEntityID FROM newEntity;
  RETURN newEntityID;
END $$;

/* Another utility procedure */
DROP FUNCTION IF EXISTS delete_entity;
CREATE OR REPLACE FUNCTION delete_entity (entityIDP INT) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  numKids INT := (SELECT COUNT(EntityID) FROM filesystem WHERE Parent = entityIDP);
  isRoot  BOOLEAN := ((SELECT Parent FROM filesystem WHERE EntityID = entityIDP) IS NULL);
BEGIN
  /* If this is a directory and has kids raise an error */
  IF numKids > 0
  THEN
    /* entity has children (please dont orphan them O_O ) */
    RAISE EXCEPTION SQLSTATE '90001' USING MESSAGE = 'entity has children (please dont orphan them O_O )';
  END IF;

  IF isRoot THEN
    /* stop trying to delete root >:( */
    RAISE EXCEPTION SQLSTATE '90001' USING MESSAGE = 'stop trying to delete root >:(';
  END IF;

  DELETE FROM filesystem WHERE EntityID = entityIDP;
END $$;


/* Insert dummy data */
DO $$
DECLARE
  rootID        filesystem.EntityID%type;
  newEntity     filesystem.EntityID%type;
  wasPopping    filesystem.EntityID%type;
  oldEntity     filesystem.EntityID%type;
BEGIN
  SELECT filesystem.EntityID INTO rootID FROM filesystem WHERE Parent = 0;
  
  newEntity := (SELECT new_entity(2, 'downloads'::VARCHAR, 1, false));
  oldEntity := (SELECT new_entity(2, 'documents'::VARCHAR, 1, false));

  wasPopping := (SELECT new_entity(oldEntity::INT, 'cool_document'::VARCHAR, 1, true));
  wasPopping := (SELECT new_entity(oldEntity::INT, 'cool_document_round_2'::VARCHAR, 1, true));
  PERFORM delete_entity(wasPopping::INT);
  wasPopping := (SELECT new_entity(oldEntity::INT, 'cool_document_round_2'::VARCHAR, 1, true));
END $$;
