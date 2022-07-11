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

Please note that you have to add /Config/.env.dev and include the env secrets. Please contact `@Jaaaa#9606` or `@Flying McCartney Monster#1172` on discord for these if you don't have them :)

## Postgres Instructions
access interactive terminal by running `docker exec -it pg_container bash`
now run this command `psql -d test_db -f infile` to load the dummy data we have prepared in ./postgres/infile
or run `make pg`



## Some Resources
Our editor uses quite a few algorithms so below is a list of resources you can use to learn about them and hopefully contribute to the editor :)
 - [Differential Synchronisation Algorithm](https://neil.fraser.name/writing/sync/eng047-fraser.pdf)
 - [Myer's Difference Algorithm](http://www.xmailserver.org/diff2.pdf)
 - [A cool blog post](https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/)
 - [String Difference Strategies](https://neil.fraser.name/writing/diff/)



## FAQs:
- Q: something is broken what to do?
- A: run `make clean` then run `make dev-build` again, should fix it

- Q: something is horibbly broken
- A: manually remove all images in docker desktop GUI app and re-run `make dev-build` again

- Q: it says I don't have docker installed, but I have already installed docker before
- A: open your docker desktop app then re-run it

- Q: it still doesnt work
- A: google docker desktop WSL2 not detecting docker

- Q: Docker is taking up alot of space how to remove?
- A: docker is a ram/storage drainer but, you can remove useless volumes, run `docker volumes prune`
