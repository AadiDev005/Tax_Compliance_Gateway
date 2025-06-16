# Tax Compliance Gateway

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/AadiDev005/Tax_Compliance_Gateway.git
   cd Tax_Compliance_Gateway
   ```

2. Start services:
   ```bash
   make up
   ```

3. Apply database migrations:
   ```bash
   make migrate
   ```

4. Seed data:
   ```bash
   make seed
   ```

5. Access endpoints:
   - Health: `curl http://localhost:8080/health`
   - Metrics: `curl http://localhost:8080/metrics`

6. Monitoring:
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000 (admin/admin)

## Development

- Hot reloading:
  ```bash
  cd services/api-gateway
  air
  ```
- Run tests:
  ```bash
  make test
  ```
