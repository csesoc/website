<<<<<<< HEAD
SERVICE := go-hotreload

dev:
	docker-compose \
	--env-file=./Config/.env.dev \
	up

dev-build:
	docker-compose \
	--env-file=./Config/.env.dev \
	up --build

pg:
	docker volume prune; \
	docker-compose \
	--env-file=./Config/.env.dev \
	up --build

cms-only:
	docker-compose \
	--env-file=./Config/.env.dev \
	up frontend backend db

cms-build:
	docker-compose \
	--env-file=./Config/.env.dev \
	up --build frontend backend db 

next-only:
	docker-compose \
	--env-file=./Config/.env.dev \
	up next backend db

next-build:
	docker-compose \
	--env-file=./Config/.env.dev \
	up --build next backend db

clean:
	docker-compose \
	--env-file=./Config/.env.dev \
	down
=======
SERVICE := go-hotreload

dev:
	docker-compose \
	--env-file=./Config/.env.dev \
	up \
	-d

dev-build:
	docker-compose \
	--env-file=./Config/.env.dev \
	up --build

pg:
	docker volume prune; \
	docker-compose \
	--env-file=./Config/.env.dev \
	up --build

cms-only:
	docker-compose \
	--env-file=./Config/.env.dev \
	up frontend backend db

cms-build:
	docker-compose \
	--env-file=./Config/.env.dev \
	up --build frontend backend db 

next-only:
	docker-compose \
	--env-file=./Config/.env.dev \
	up next backend db

next-build:
	docker-compose \
	--env-file=./Config/.env.dev \
	up --build next backend db

clean:
	docker-compose \
	--env-file=./Config/.env.dev \
	down
>>>>>>> main
