CREATE EXTENSION IF NOT EXISTS hstore;
SET timezone = 'Australia/Sydney';

/* A group provides users with specific access permissions for certain entities */
DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
  GroupID       SERIAL PRIMARY KEY,
  Name          VARCHAR(50) NOT NULL
);

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
)
