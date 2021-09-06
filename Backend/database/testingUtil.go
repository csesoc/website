package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
	"github.com/ory/dockertest"
	"github.com/ory/dockertest/docker"
)

// Extends functions and functionality fo spinning up mock databases while
// unit and integration testing
const startupScript string = `CREATE EXTENSION hstore;
SET timezone = 'Australia/Sydney';

DROP TABLE IF EXISTS person;
CREATE TABLE person (
  UID serial PRIMARY KEY,
  Email VARCHAR(50) UNIQUE NOT NULL,
  First_name VARCHAR(50) NOT NULL,
  Password VARCHAR(50) NOT NULL
);

INSERT INTO person (Email, First_name, Password)
VALUES ('test@test.com', 'adam', 'password');
INSERT INTO person(Email, First_name, Password)
VALUES ('asdas@asdads.com', 'adamee', 'password');


/* Stub for whenever jacky does it */
CREATE TABLE groups (
  UID   SERIAL PRIMARY KEY,
  Name  VARCHAR(50) NOT NULL
);
INSERT INTO groups (Name)
  VALUES ('admin');



DROP TABLE IF EXISTS filesystem;
CREATE TABLE filesystem (
  EntityID      SERIAL PRIMARY KEY,
  LogicalName   VARCHAR(50) NOT NULL,
  
  IsDocument    BOOLEAN DEFAULT false,
  IsPublished   BOOLEAN DEFAULT false,
  CreatedAt     TIMESTAMP NOT NULL DEFAULT NOW(),

  OwnedBy       INT,
  Parent        INT REFERENCES filesystem(EntityID) DEFAULT NULL,
  Children      hstore DEFAULT NULL,

  /* FK Constraint */
  CONSTRAINT fk_owner FOREIGN KEY (OwnedBy) 
    REFERENCES groups(UID),
  /* Unique name constraint: there should not exist an entity of the same type with the
     same parent and logical name. */
  CONSTRAINT unique_name UNIQUE (Parent, LogicalName, IsDocument)        
);

/* Insert root directory and then add our constraints */
DO $$
DECLARE 
  randomGroup groups.UID%type;
  rootID      filesystem.EntityID%type;
BEGIN
  SELECT groups.UID INTO randomGroup FROM groups WHERE Name = 'admin'::VARCHAR;

  /* Insert the root directory */
  INSERT INTO filesystem (LogicalName, OwnedBy, Children)
    VALUES ('root', randomGroup, ''::hstore);
  SELECT filesystem.EntityID INTO rootID FROM filesystem WHERE LogicalName = 'root'::VARCHAR;

  /* insert "has parent" constraint*/
  EXECUTE 'ALTER TABLE filesystem 
    ADD CONSTRAINT has_parent CHECK (Parent IS NOT NULL OR EntityID = '||rootID||')';
  /* Assert that the entity isnt a document with directory properties
    or vice-versa*/                    
  EXECUTE 'ALTER TABLE filesystem
      ADD CONSTRAINT valid_entity CHECK ((IsDocument AND Children IS NULL) 
                                  OR (NOT IsDocument AND Children IS NOT NULL AND NOT IsPublished) OR EntityID = '||rootID||')';
END $$;


/* Utility procedure :) */
DROP FUNCTION IF EXISTS new_entity;
CREATE OR REPLACE FUNCTION new_entity (parentP INT, logicalNameP VARCHAR, ownedByP INT, isDocumentP BOOLEAN DEFAULT false) RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  newEntityID filesystem.EntityID%type;
  childSet hstore := NULL;
BEGIN
  /* If we are inserting a new directory just update the childset to an empty hstore instead */
  IF NOT isDocumentP THEN
    childSet := ''::hstore;
  END IF;

  WITH newEntity AS (
    INSERT INTO filesystem (LogicalName, IsDocument, OwnedBy, Parent, Children)
      VALUES (logicalNameP, isDocumentP, ownedByP, parentP, childSet)
      RETURNING EntityID
  )
  SELECT newEntity.EntityID INTO newEntityID FROM newEntity;

  UPDATE filesystem
    SET Children = Children || (newEntityID::TEXT || '=>"."')::hstore
  WHERE EntityID = parentP;

  RETURN newEntityID;
END $$;


/* Insert dummy data */
DO $$
DECLARE
  rootID        filesystem.EntityID%type;
  newEntity     filesystem.EntityID%type;
  wasPopping    filesystem.EntityID%type;
BEGIN
  SELECT filesystem.EntityID INTO rootID FROM filesystem WHERE Parent IS NULL;
  
  newEntity := (SELECT new_entity(rootID::INT, 'downloads'::VARCHAR, 1, false));
  newEntity := (SELECT new_entity(rootID::INT, 'documents'::VARCHAR, 1, false));

  wasPopping := (SELECT new_entity(newEntity::INT, 'cool_document'::VARCHAR, 1, true));
  wasPopping := (SELECT new_entity(newEntity::INT, 'cool_document_round_2'::VARCHAR, 1, true));
END $$;`

// Please close your docker database spin ups, please and thank you
func SpinTestDB() string {
	var db *sql.DB

	pool, err := dockertest.NewPool("")
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	// pulls an image, creates a container based on it and runs it
	resource, err := pool.RunWithOptions(&dockertest.RunOptions{
		Repository: "postgres",
		Tag:        "11",
		Env: []string{
			"POSTGRES_PASSWORD=test",
			"POSTGRES_USER=postgres",
			"POSTGRES_DB=cms_testing_db",
			"listen_addresses = '*'",
		},
	}, func(config *docker.HostConfig) {
		// set AutoRemove to true so that stopped container goes away by itself
		config.AutoRemove = true
		config.RestartPolicy = docker.RestartPolicy{Name: "no"}
	})
	if err != nil {
		log.Fatalf("Could not start resource: %s", err)
	}

	hostAndPort := resource.GetHostPort("5432/tcp")
	databaseUrl := fmt.Sprintf("postgres://postgres:test@%s/cms_testing_db?sslmode=disable", hostAndPort)

	resource.Expire(180)
	pool.MaxWait = 120 * time.Second
	if err = pool.Retry(func() error {
		db, err = sql.Open("postgres", databaseUrl)
		if err != nil {
			return err
		}
		return db.Ping()
	}); err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	_, err = db.Query(startupScript)
	if err != nil {
		panic(err)
	}

	return hostAndPort
}
