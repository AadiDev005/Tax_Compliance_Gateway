.PHONY: up down build test migrate seed
up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
down:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
build:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
test:
	cd services/api-gateway && go test ./...
migrate:
	cd tools/cli && go run cmd/migrate/main.go
seed:
	docker exec -i tax_compliance_gateway-postgres-1 psql -U tax_user -d tax_compliance < data/seeds/tax-jurisdictions/seed.sql
