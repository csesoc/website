/* front end url to id */ 
DROP TABLE IF EXISTS frontend;
CREATE TABLE frontend (
  FrontendID  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  FrontendLogicalName VARCHAR(100),
  FrontendURL VARCHAR(100)
);