DROP TABLE IF EXISTS person;
CREATE TABLE person (
  UID           SERIAL PRIMARY KEY,
  Email         VARCHAR(50) UNIQUE NOT NULL,
  First_name    VARCHAR(50) NOT NULL,
  Password      CHAR(64) NOT NULL,

  isOfGroup     INT,
  frontendid    INT, 

  CONSTRAINT fk_AccessLevel FOREIGN KEY (isOfGroup)
    REFERENCES groups(UID),

  CONSTRAINT fk_AccessFrontend FOREIGN KEY (frontendid)
    REFERENCES frontend(FrontendID),

  /* non duplicate email and password constraints */
  CONSTRAINT no_dupes UNIQUE (Email, Password)
);

/* create user function plpgsql */
DROP FUNCTION IF EXISTS create_normal_user;
CREATE OR REPLACE FUNCTION create_normal_user (email VARCHAR, name VARCHAR, password VARCHAR, frontendID INT) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
BEGIN
  INSERT INTO person (Email, First_name, Password, isOfGroup, frontendID)
    VALUES (email, name, encode(sha256(password::BYTEA), 'hex'), 2, 1);
END $$;