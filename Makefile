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

next-only:
	docker-compose \
	--env-file=./Config/.env.dev \
	up next backend db

clean:
	docker-compose \
	--env-file=./Config/.env.dev \
	down