FROM golang:1.24-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o tax-engine ./cmd/server/main.go

FROM alpine:latest
RUN apk add --no-cache ca-certificates wget
WORKDIR /app
COPY --from=builder /app/tax-engine .
RUN chmod +x ./tax-engine
EXPOSE 8082
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:8082/health || exit 1
CMD ["./tax-engine"]
