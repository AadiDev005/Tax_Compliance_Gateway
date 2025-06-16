CREATE TABLE jurisdictions (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(2) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tax_rules (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INT REFERENCES jurisdictions(id),
    rule_type VARCHAR(50) NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    effective_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    user_id UUID,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
