FROM golang:1.24.3-alpine

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o tax-engine cmd/server/main.go

CMD ["./tax-engine"]
