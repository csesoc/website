SET timezone = 'Australia/Sydney';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  MetaID        uuid NOT NULL,

  OwnedBy       INT,
  /* Pain */
  Parent        uuid REFERENCES filesystem(EntityID) DEFAULT NULL,

  /* FK Constraint */
  CONSTRAINT fk_owner FOREIGN KEY (OwnedBy) 
    REFERENCES groups(UID),

  /* Unique name constraint: there should not exist an entity of the same type with the
     same parent and logical name. */
  CONSTRAINT unique_name UNIQUE (Parent, LogicalName, IsDocument)        
);

/**
  Metadata table
**/
DROP TABLE IF EXISTS metadata;
CREATE TABLE metadata (
  
  MetaID        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  EntityID      uuid NOT NULL,
  CreatedAt     TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_file FOREIGN KEY (EntityID)
    REFERENCES filesystem(EntityID),

  CONSTRAINT unique_id UNIQUE (EntityID)
);
/* Have to do this because metadata and filesystem references each other. */
ALTER TABLE filesystem add CONSTRAINT fk_meta 
    FOREIGN KEY (MetaID) 
    REFERENCES metadata(MetaID);

/* Utility procedure :) */
DROP FUNCTION IF EXISTS new_entity;
CREATE OR REPLACE FUNCTION new_entity (parentP uuid, logicalNameP VARCHAR, ownedByP INT, isDocumentP BOOLEAN DEFAULT false) RETURNS uuid
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
