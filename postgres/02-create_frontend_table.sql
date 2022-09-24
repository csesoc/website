/* front end url to id */ 
DROP TABLE IF EXISTS frontend;
CREATE TABLE frontend (
  FrontendID  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  FrontendURL VARCHAR(100)

  CONSTRAINT fk_AccessFilesystem FOREIGN KEY (FrontendID)
    REFERENCES filesystem(EntityID)
);