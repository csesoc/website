CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* Maps frontend URL to its name and root within filesystem */ 
DROP TABLE IF EXISTS frontend;
CREATE TABLE frontend 
(
  ID  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  LogicalName VARCHAR(100),
  URL VARCHAR(100),
  Root uuid NOT NULL,
  
  CONSTRAINT fk_frontendRoot FOREIGN KEY (Root)
    REFERENCES filesystem(entityID)
);

-- TODO: Add a delete frontend function
DROP FUNCTION IF EXISTS new_frontend;
CREATE OR REPLACE FUNCTION new_frontend (logicalNameP VARCHAR, URLP VARCHAR) 
  RETURNS TABLE (feID uuid, feRoot uuid)
LANGUAGE plpgsql
AS $$
DECLARE
  frontendIDP  frontend.ID%type;
  frontendRoot frontend.Root%type;
  newMetadataID filesystem.MetadataID%type;
BEGIN
  -- TODO: Temporarily setting the OwnedBy field. Going to be deprecated soon.
  INSERT INTO metadata DEFAULT VALUES RETURNING MetadataID INTO newMetadataID;
  INSERT INTO filesystem (LogicalName, IsDocument, Parent, OwnedBy, MetadataID)
    VALUES (logicalNameP, false, uuid_nil(), 1, newMetadataID)
    RETURNING entityID INTO frontendRoot;
    
  INSERT INTO frontend 
    VALUES (uuid_generate_v4(), logicalNameP, URLP, frontendRoot)
    RETURNING ID INTO frontendIDP;
    
  RETURN QUERY SELECT frontendIDP, frontendRoot;
END $$;


/* Users are assigned groups. They can belong to many groups. 
Each frontend can have many groups. 

The frontend's groups are maintained here.
*/
DROP TABLE IF EXISTS frontend_membership;
CREATE TABLE frontend_membership (
  FrontendID    uuid NOT NULL,
  GroupID       INT NOT NULL,
  
  CONSTRAINT fk_AccessFrontendID FOREIGN KEY (FrontendID)
    REFERENCES frontend(ID),

  CONSTRAINT fk_AccessGroupID FOREIGN KEY (GroupID)
    REFERENCES groups(GroupID)
);