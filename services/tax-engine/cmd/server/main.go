package main

import (
    "context"
    "fmt"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var taxRates = map[string]float64{
    "mexico":  0.16,
    "germany": 0.19,
}

type TaxRate struct {
    Country string  `json:"country" bson:"country"`
    Rate    float64 `json:"rate" bson:"rate"`
}

var client *mongo.Client

func initDB() {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    var err error
    maxRetries := 5
    for i := 0; i < maxRetries; i++ {
        client, err = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://mongodb:27017"))
        if err == nil {
            if err := client.Ping(ctx, nil); err == nil {
                break
            }
        }
        if i < maxRetries-1 {
            time.Sleep(time.Second * time.Duration(i+1))
            fmt.Printf("Retrying MongoDB connection... Attempt %d/%d\n", i+2, maxRetries)
        }
    }
    if err != nil {
        panic(fmt.Sprintf("Failed to connect to MongoDB after %d attempts: %v", maxRetries, err))
    }
    collection := client.Database("tax_compliance").Collection("tax_rates")
    for country, rate := range taxRates {
        _, err := collection.UpdateOne(
            ctx,
            map[string]string{"country": country},
            map[string]interface{}{"$set": TaxRate{Country: country, Rate: rate}},
            options.Update().SetUpsert(true),
        )
        if err != nil {
            fmt.Printf("Warning: Could not insert/update %s rate: %v\n", country, err)
        } else {
            fmt.Printf("Successfully inserted/updated %s rate: %f\n", country, rate)
        }
    }
}

func calculateTax(c *gin.Context) {
    country := c.Query("country")
    amount := c.Query("amount")

    collection := client.Database("tax_compliance").Collection("tax_rates")
    var rate TaxRate
    err := collection.FindOne(context.Background(), map[string]string{"country": country}).Decode(&rate)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "country not found"})
        return
    }

    var tax = rate.Rate * toFloat(amount)
    c.JSON(http.StatusOK, gin.H{"tax": tax})
}

func toFloat(s string) float64 {
    var f float64
    fmt.Sscanf(s, "%f", &f)
    return f
}

func main() {
    initDB()
    r := gin.Default()
    r.GET("/calculate-tax", calculateTax)
    r.Run(":8082")
}
