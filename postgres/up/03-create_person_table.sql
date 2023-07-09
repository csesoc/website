DROP TABLE IF EXISTS person;
CREATE TABLE person (
  UID           SERIAL PRIMARY KEY,
  Email         VARCHAR(50) UNIQUE NOT NULL,
  First_name    VARCHAR(50) NOT NULL,
  Password      CHAR(64) NOT NULL,

  /* non duplicate email and password constraints */
  CONSTRAINT no_dupes UNIQUE (Email, Password)
);

/* create user function plpgsql */
DROP FUNCTION IF EXISTS create_normal_user;
CREATE OR REPLACE FUNCTION create_normal_user (email VARCHAR, name VARCHAR, password VARCHAR) RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  userID      INT;
BEGIN
  INSERT INTO person (Email, First_name, Password)
    VALUES (email, name, encode(sha256(password::BYTEA), 'hex')) 
  RETURNING UID INTO userID;
  RETURN userID;
END $$;

/* Manages the membership of users to groups */
DROP TABLE IF EXISTS group_membership;
CREATE TABLE group_membership (
  GroupID       INT NOT NULL,
  UID           INT NOT NULL,
  
  CONSTRAINT fk_AccessUser FOREIGN KEY (UID)
    REFERENCES person(UID),

  CONSTRAINT fk_AccessGroupID FOREIGN KEY (GroupID)
    REFERENCES groups(GroupID)
);