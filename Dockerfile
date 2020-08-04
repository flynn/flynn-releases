FROM golang:1.12.5-alpine

WORKDIR /app

RUN apk add npm git bash ruby

COPY . .
RUN export GOPROXY=https://proxy.golang.org &&\
    go build -o app &&\
    cd assets && go run compile.go

CMD ["/app/app"]
