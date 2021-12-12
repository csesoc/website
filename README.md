# cms.csesoc.unsw.edu.au

Welcome to the CSESoc CMS Git Repo!! :D 


## Build Instructions
Building the app fresh after installation
run:
`docker compose up --build`

For all subsequent running of apps
run:
`docker compose up`
or
`docker compose up -d`

Please note that you have to add /Config/.env.dev and include the env secrets. Please contact @omeh-a (Matt_#4292 on discord or matthewrossouw@outlook.com) for these if you don't have them :)

## Postgres Instructions
access interactive terminal by running `docker exec -it pg_container bash`
now run this command `psql -d test_db -f infile` to load the dummy data we have prepared in ./postgres/infile



## Some Resources
Our editor uses quite a few algorithms so below is a list of resources you can use to learn about them and hopefully contribute to the editor :)
 - [Differential Synchronisation Algorithm](https://neil.fraser.name/writing/sync/eng047-fraser.pdf)
 - [Myer's Difference Algorithm](http://www.xmailserver.org/diff2.pdf)
 - [A cool blog post](https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/)
 - [String Difference Strategies](https://neil.fraser.name/writing/diff/)
