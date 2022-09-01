SET timezone = 'Australia/Sydney';

/**
  The filesystem table models all file heirachies in our system
**/
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