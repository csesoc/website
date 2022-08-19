SERVICE := go-hotreload

dev:
	docker-compose \
	--env-file=./config/.env.dev \
	up \
	-d

dev-build:
	docker-compose \
	--env-file=./config/.env.dev \
	up --build

pg:
	docker volume prune; \
	docker-compose \
	--env-file=./config/.env.dev \
	up --build

cms-only:
	docker-compose \
	--env-file=./config/.env.dev \
	up frontend backend db

cms-build:
	docker-compose \
	--env-file=./config/.env.dev \
	up --build frontend backend db 

next-only:
	docker-compose \
	--env-file=./config/.env.dev \
	up next backend db

next-build:
	docker-compose \
	--env-file=./config/.env.dev \
	up --build next backend db

clean:
	docker-compose \
	--env-file=./config/.env.dev \
	down
