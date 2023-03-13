CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* Maps frontend URL to its name and root within filesystem */ 
DROP TABLE IF EXISTS frontend;
CREATE TABLE frontend (
  ID  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  LogicalName VARCHAR(100),
  URL VARCHAR(100)
);