FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o business-portal ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates curl
WORKDIR /root/
COPY --from=builder /app/business-portal .
EXPOSE 8086
CMD ["./business-portal"]
