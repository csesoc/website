SET timezone = 'Australia/Sydney';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* Simulating data flow of CMS */

DO $$
DECLARE
  frontendID          frontend.ID%type;
  rootID              frontend.root%type;
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
    
  -- Create access groups
  INSERT INTO groups (Name) VALUES 
    ('blog_owners') 
  RETURNING GroupID INTO blogGroup;
  INSERT INTO groups (Name) VALUES 
    ('about_owners') 
  RETURNING GroupID INTO aboutGroup;
    
  -- Create a new frontend
  SELECT feID, feRoot INTO frontendID, rootID FROM 
    new_frontend('CSESoc Main Website', 'http://localhost:3000');
  
  -- Assign groups to frontend
  INSERT INTO frontend_membership VALUES (frontendID, blogGroup);
  INSERT INTO frontend_membership VALUES (frontendID, aboutGroup);
  
  -- Add users to groups
  INSERT INTO group_membership VALUES (blogGroup, user1);
  INSERT INTO group_membership VALUES (aboutGroup, user2);
  INSERT INTO group_membership VALUES (aboutGroup, user3);
  
  /* Users begin adding entities (files/directories) */
  -- TODO: Add permissions logic (trying to do this via new_entity to save the hassle)
  
  -- Blog group adds directories
  blogDirectory := (SELECT new_entity(rootID, 'downloads', 1));
  blogDirectory := (SELECT new_entity(rootID, 'blog_documents', 1));
  -- Blog group adds documents to 'documents' directory
  blogDocument := (SELECT new_entity(blogDirectory, 'cool_document.txt', 1, true));
  blogDocument := (SELECT new_entity(blogDirectory, 'cool_document2.txt', 1, true));
  -- Delete and readd
  PERFORM delete_entity(blogDocument);
  blogDocument := (SELECT new_entity(blogDirectory, 'cool_document2.txt', 1, true));
  
  -- About group adds directory
  aboutDirectory := (SELECT new_entity(rootID, 'about_page', 1));
  -- Proceeds to add second layer directory
  aboutDirectory2 := (SELECT new_entity(aboutDirectory, 'about_projects', 1));
END $$;