SERVICE := go-hotreload

dev:
	GO_MOD=go.mod docker compose up

dev-build:
	GO_MOD=go.mod docker compose up --build
