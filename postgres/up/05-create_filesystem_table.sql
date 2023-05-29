SET timezone = 'Australia/Sydney';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* MetaData */
DROP TABLE IF EXISTS metadata;
CREATE TABLE metadata (
  MetadataID    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  CreatedAt     TIMESTAMP NOT NULL DEFAULT NOW()
);

/**
  The filesystem table models all file heirachies in our system
**/
DROP TABLE IF EXISTS filesystem;
CREATE TABLE filesystem (
  EntityID      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  LogicalName   VARCHAR(50) NOT NULL,
  
  IsDocument    BOOLEAN DEFAULT false,
  IsPublished   BOOLEAN DEFAULT false,
  CreatedAt     TIMESTAMP NOT NULL DEFAULT NOW(),
  
  /* MetaData */
  -- MetadataID        uuid NOT NULL,

  OwnedBy       INT,
  /* Pain */
  Parent        uuid NOT NULL,

  /* FK Constraint */
  CONSTRAINT fk_owner FOREIGN KEY (OwnedBy) 
    REFERENCES groups(GroupID),

  -- CONSTRAINT fk_meta FOREIGN KEY (MetadataID) REFERENCES metadata(MetadataID),

  /* Unique name constraint: there should not exist an entity of the same type with the
     same parent and logical name. */
  CONSTRAINT unique_name UNIQUE (Parent, LogicalName, IsDocument)        
);

/* Utility procedure :) */
DROP FUNCTION IF EXISTS new_entity;
CREATE OR REPLACE FUNCTION new_entity (parentP uuid, logicalNameP VARCHAR, isDocumentP BOOLEAN DEFAULT false) RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  newEntityID filesystem.EntityID%type;
  parentIsDocument BOOLEAN := (SELECT IsDocument FROM filesystem WHERE EntityID = parentP LIMIT 1);
BEGIN
  IF parentIsDocument THEN
    /* We shouldn't be declaring that a document is our parent */
    RAISE EXCEPTION SQLSTATE '90001' USING MESSAGE = 'cannot make parent a document';
  END If;
  WITH newEntity AS (
    INSERT INTO filesystem (LogicalName, IsDocument, Parent)
      VALUES (logicalNameP, isDocumentP, parentP)
      RETURNING EntityID
  )

  SELECT newEntity.EntityID INTO newEntityID FROM newEntity;
  RETURN newEntityID;
END $$;

-- TODO: Add a delete frontend function
DROP FUNCTION IF EXISTS new_frontend;
CREATE OR REPLACE FUNCTION new_frontend (frontendIDP uuid, logicalNameP VARCHAR, URLP VARCHAR) RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  frontendID frontend.ID%type;
BEGIN
  INSERT INTO frontend VALUES (frontendIDP, logicalNameP, URLP)
    RETURNING ID INTO frontendID;
                  
  INSERT INTO filesystem (EntityID, LogicalName, IsDocument, Parent)
    VALUES (frontendID, logicalNameP, false, uuid_nil());
    
  RETURN frontendID;
END $$;

/* Another utility procedure */
DROP FUNCTION IF EXISTS delete_entity;
CREATE OR REPLACE FUNCTION delete_entity (entityIDP uuid) RETURNS void
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

/* All entities have differing permissions based on the group 
   Access in ascending permission: read -> write -> delete
*/

CREATE TYPE permissions_enum as ENUM ('read', 'write', 'delete');
DROP TABLE IF EXISTS permissions;
CREATE TABLE permissions (
    /* Note: Directories can have permissions, they are overarching */
    EntityID                    uuid NOT NULL,
    GroupID                     INT REFERENCES groups(GroupID),
    Permission permissions_enum NOT NULL
);
