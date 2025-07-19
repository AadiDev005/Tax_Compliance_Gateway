package handlers

import (
	"database/sql"
	"encoding/json"
	"log"

	"github.com/Shopify/sarama"
)

type TaxRuleEvent struct {
	ID             int     `json:"id"`
	JurisdictionID string  `json:"jurisdiction_id"`
	Rate           float64 `json:"rate"`
	RuleType       string  `json:"rule_type"`
	Description    string  `json:"description"`
	EffectiveDate  string  `json:"effective_date"`
	EventType      string  `json:"event_type"`
}

func ConsumeTaxRules(db *sql.DB, consumer sarama.Consumer) {
	partitionConsumer, err := consumer.ConsumePartition("tax_rules", 0, sarama.OffsetOldest)
	if err != nil {
		log.Printf("Error starting consumer: %v", err)
		return
	}
	defer partitionConsumer.Close()

	for msg := range partitionConsumer.Messages() {
		log.Printf("Processing tax rule event: %s", string(msg.Value))
		var event TaxRuleEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			log.Printf("Error unmarshaling Kafka message: %v", err)
			continue
		}

		_, err = db.Exec(
			"INSERT INTO tax_rules (jurisdiction_id, rate, rule_type, description, effective_date) VALUES ($1, $2, $3, $4, $5)",
			event.JurisdictionID, event.Rate, event.RuleType, event.Description, event.EffectiveDate,
		)
		if err != nil {
			log.Printf("Error inserting tax rule: %v", err)
			continue
		}
		log.Printf("Successfully inserted tax rule for jurisdiction: %s", event.JurisdictionID)
	}
}
