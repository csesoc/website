SET timezone = 'Australia/Sydney';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* Simulating data flow of CMS */

DO $$
DECLARE
  rootID              frontend.ID%type;
  blogGroup           INT;  
  aboutGroup          INT;
  user1               INT;
  user2               INT;
  user3               INT;
  
  blogDirectory       filesystem.EntityID%type;
  blogDocument        filesystem.EntityID%type;
  blogDeletedDocument filesystem.EntityID%type;
  
  aboutDirectory      filesystem.EntityID%type;
  aboutDirectory2     filesystem.EntityID%type;
BEGIN
  /* Admin setup */
  
  -- Account creations
  user1 := (SELECT 
    create_normal_user('z0000000@ad.unsw.edu.au', 'adam', 'password'));
  user2 := (SELECT 
    create_normal_user('john.smith@gmail.com', 'john', 'password'));
  user3 := (SELECT 
    create_normal_user('jane.doe@gmail.com', 'jane', 'password'));
    
  -- Create a new frontend (frontendID should be generated code-side)
  rootID := (SELECT new_frontend(uuid_generate_v4(), 'CSESoc Main Website', 'http://localhost:3000'));
  
  -- Create access groups
  INSERT INTO groups (Name) VALUES 
    ('blog_owners') 
  RETURNING GroupID INTO blogGroup;
  INSERT INTO groups (Name) VALUES 
    ('about_owners') 
  RETURNING GroupID INTO aboutGroup;
  
  -- Assign groups to frontend
  INSERT INTO frontend_membership VALUES (rootID, blogGroup);
  INSERT INTO frontend_membership VALUES (rootID, aboutGroup);
  
  -- Add users to groups
  INSERT INTO group_membership VALUES (blogGroup, user1);
  INSERT INTO group_membership VALUES (aboutGroup, user2);
  INSERT INTO group_membership VALUES (aboutGroup, user3);
  
  /* Users begin adding entities (files/directories) */
  -- TODO: Add permissions logic (trying to do this via new_entity to save the hassle)
  
  -- Blog group adds directories
  blogDirectory := (SELECT new_entity(rootID, 'downloads'));
  blogDirectory := (SELECT new_entity(rootID, 'blog_documents'));
  -- Blog group adds documents to 'documents' directory
  blogDocument := (SELECT new_entity(blogDirectory, 'cool_document.txt', true));
  blogDocument := (SELECT new_entity(blogDirectory, 'cool_document2.txt', true));
  -- Delete and readd
  PERFORM delete_entity(blogDocument);
  blogDocument := (SELECT new_entity(blogDirectory, 'cool_document2.txt', true));
  
  -- About group adds directory
  aboutDirectory := (SELECT new_entity(rootID, 'about_page'));
  -- Proceeds to add second layer directory
  aboutDirectory2 := (SELECT new_entity(aboutDirectory, 'about_projects'));
END $$;