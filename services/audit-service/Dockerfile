# Build stage
FROM golang:1.24-alpine AS builder
WORKDIR /go/src/tax-compliance-gateway
COPY . /go/src/tax-compliance-gateway/
WORKDIR /go/src/tax-compliance-gateway/services/audit-service
COPY go.mod go.sum ./
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o audit-service ./cmd/server/main.go

# Final stage
FROM alpine:latest
RUN apk add --no-cache ca-certificates wget
WORKDIR /app
COPY --from=builder /go/src/tax-compliance-gateway/services/audit-service/audit-service .
RUN chmod +x ./audit-service
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:8081/health || exit 1
CMD ["./audit-service"]
