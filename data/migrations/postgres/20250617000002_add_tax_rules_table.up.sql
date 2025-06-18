CREATE TABLE tax_rules (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INTEGER NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    effective_date TIMESTAMP NOT NULL,
    description TEXT
);
