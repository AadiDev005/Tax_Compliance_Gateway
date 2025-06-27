FROM golang:1.24-alpine
RUN apk add --no-cache git curl
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o audit-service ./cmd/server/main.go
CMD ["./audit-service"]
