#!/bin/bash
# $1 = filename

echo "Welcome to the create user command line for CMS"
echo "please input your name: "
read name
echo "please input your email: "
echo "accepted formats are: gmail/ ad.unsw.edu.au / student.unsw.edu.au"
read email
echo "please input your password: "
read password

# not sure if this is vulnerable to command injection?
docker exec pg_container psql -U postgres -d test_db -c "select create_normal_user('$email', '$name', '$password');"
