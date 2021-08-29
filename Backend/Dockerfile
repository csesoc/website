FROM golang:1.17-alpine

# make current working directory /app
WORKDIR /app

# copy go.mod and go.sum
COPY go.mod .
COPY go.sum .

# downloding dependencies
RUN go mod download

# copying source files
COPY . . 

# run make
CMD ["make"]

EXPOSE 8080

CMD ["go", "run", "main.go"]
