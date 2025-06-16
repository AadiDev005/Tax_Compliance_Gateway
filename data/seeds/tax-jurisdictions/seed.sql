INSERT INTO jurisdictions (country_code, name) VALUES
('MX', 'Mexico'),
('DE', 'Germany'),
('PL', 'Poland'),
('IT', 'Italy'),
('BR', 'Brazil');
INSERT INTO tax_rules (jurisdiction_id, rule_type, rate, effective_date, description) VALUES
((SELECT id FROM jurisdictions WHERE country_code = 'MX'), 'IVA', 16.00, '2025-01-01', 'Standard IVA rate'),
((SELECT id FROM jurisdictions WHERE country_code = 'DE'), 'VAT', 19.00, '2025-01-01', 'Standard VAT rate'),
((SELECT id FROM jurisdictions WHERE country_code = 'PL'), 'VAT', 23.00, '2025-01-01', 'Standard VAT rate'),
((SELECT id FROM jurisdictions WHERE country_code = 'IT'), 'VAT', 22.00, '2025-01-01', 'Standard VAT rate'),
((SELECT id FROM jurisdictions WHERE country_code = 'BR'), 'ICMS', 17.00, '2025-01-01', 'Standard ICMS rate');
