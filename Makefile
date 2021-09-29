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

clean:
	docker-compose down