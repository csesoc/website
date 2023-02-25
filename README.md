# cms.csesoc.unsw.edu.au

Welcome to the CSESoc CMS Git Repo!! :D 


## Build Instructions
Building the app fresh after installation
run:
`make dev-build`

all subsequent running of the app you can 
run:
`make`

what to do after you are done programming?
run: 
`make clean`

when dependencies have changed i.e. you installed a new package, updated version of a package
run:
`make dev-build`

## Environment Variables

Please note that you have to add /Config/.env.dev and include the env secrets. Please contact `laurlala#1696`, `jumbo#9999` or `Mae#6758` on discord for these if you don't have them :)

## Postgres Instructions
Access interactive terminal by running `docker exec -it pg_container bash`
now run this command `psql -d test_db -f infile` to load the dummy data we have prepared in ./postgres/infile
or run `make pg`


## FAQs:
- Q: Something is broken what to do?
- A: Run `make clean` then run `make dev-build` again, should fix it, if it is still broken then manually remove all images in the docker desktop GUI and re-run `make dev-build`.

- Q: Something has gone wrong with Docker, where can I find docker resources?
- A: Docker is rather well documented, check out the docker website: https://www.docker.com/ to try and resolve your issue.
