CREATE TABLE IF NOT EXISTS tax_rules (
    id SERIAL PRIMARY KEY,
    jurisdiction_id TEXT NOT NULL UNIQUE,
    rate DOUBLE PRECISION NOT NULL,
    rule_type TEXT NOT NULL,
    effective_date TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    event TEXT NOT NULL,
    jurisdiction_id TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    created_at TEXT NOT NULL
);
INSERT INTO tax_rules (jurisdiction_id, rate, rule_type, effective_date)
VALUES
    ('MX', 0.16, 'VAT', '2025-07-04'),
    ('DE', 0.19, 'VAT', '2025-07-04')
ON CONFLICT (jurisdiction_id) DO NOTHING;
