INSERT INTO jurisdictions (country_code, name) VALUES
('MX', 'Mexico'),
('DE', 'Germany'),
('PL', 'Poland'),
('IT', 'Italy'),
('BR', 'Brazil')
ON CONFLICT (country_code) DO NOTHING;

INSERT INTO tax_rules (jurisdiction_id, rule_type, rate, effective_date, description)
SELECT j.id, r.rule_type, r.rate, r.effective_date::DATE, r.description
FROM (VALUES
    ('MX', 'IVA', 16.00, '2025-01-01', 'Standard IVA rate'),
    ('DE', 'VAT', 19.00, '2025-01-01', 'Standard VAT rate'),
    ('PL', 'VAT', 23.00, '2025-01-01', 'Standard VAT rate'),
    ('IT', 'VAT', 22.00, '2025-01-01', 'Standard VAT rate'),
    ('BR', 'ICMS', 17.00, '2025-01-01', 'Standard ICMS rate')
) AS r(country_code, rule_type, rate, effective_date, description)
JOIN jurisdictions j ON j.country_code = r.country_code
WHERE NOT EXISTS (
    SELECT 1 FROM tax_rules tr
    WHERE tr.jurisdiction_id = j.id
    AND tr.rule_type = r.rule_type
    AND tr.rate = r.rate
    AND tr.effective_date = r.effective_date::DATE
);
