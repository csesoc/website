FROM golang:1.17-alpine as build-env

# make current working directory /app
WORKDIR /go/src/cms.csesoc.unsw.edu.au

# copy go.mod and go.sum
COPY go.mod go.sum ./

COPY . .


# downloding dependencies
RUN go mod download
RUN apk add --update npm
RUN go get github.com/githubnemo/CompileDaemon

WORKDIR html
RUN npm install
WORKDIR ..


EXPOSE 8080

# export environment variable for gopath
ENV GOPATH /go

# might start the app
#CMD ["go", "run", "main.go"]

ENTRYPOINT CompileDaemon --build="go build main.go" --command="./main"