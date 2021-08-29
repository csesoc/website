FROM golang:1.17-alpine as build-env

# make current working directory /app
WORKDIR /go/app

# copy go.mod and go.sum
COPY go.mod .
COPY go.sum .

# downloding dependencies
RUN go mod download

# copying source files
COPY . . 

EXPOSE 8080

# export environment variable for gopath
ENV GOPATH /go

# run make
# might start the app
CMD ["go", "run", "main.go"]

