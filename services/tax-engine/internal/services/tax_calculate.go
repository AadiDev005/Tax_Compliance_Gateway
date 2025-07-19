package services

import (
    "context"
    "tax-compliance-gateway/tax-engine/internal/repository"
)

type TaxService struct {
    repo *repository.TaxRuleRepository
}

func NewTaxService(repo *repository.TaxRuleRepository) *TaxService {
    return &TaxService{repo: repo}
}

func (s *TaxService) CalculateTax(ctx context.Context, amount float64, jurisdictionID string) (float64, float64, error) {
    rate, err := s.repo.GetTaxRate(ctx, jurisdictionID)
    if err != nil {
        return 0, 0, err
    }
    tax := amount * rate
    total := amount + tax
    return tax, total, nil
}
