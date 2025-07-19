FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o regulatory-service ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates curl
WORKDIR /root/
COPY --from=builder /app/regulatory-service .
EXPOSE 8085
CMD ["./regulatory-service"]
