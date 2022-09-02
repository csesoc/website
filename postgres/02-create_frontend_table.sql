/* front end url to id */ 
DROP TABLE IF EXISTS frontend;
CREATE TABLE frontend (
  FrontendID  SERIAL PRIMARY KEY,
  FrontendURL VARCHAR(100)
);