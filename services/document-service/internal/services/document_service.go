package services

import (
    "context"
    "tax-compliance-gateway/document-service/internal/config"
    "tax-compliance-gateway/document-service/internal/models"
    "time"
    
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
)

type DocumentService struct {
    collection *mongo.Collection
    config     *config.Config
}

func NewDocumentService(database *mongo.Database, cfg *config.Config) *DocumentService {
    return &DocumentService{
        collection: database.Collection("documents"),
        config:     cfg,
    }
}

func (ds *DocumentService) SaveDocument(doc *models.Document) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    doc.UploadedAt = time.Now()
    doc.Status = models.StatusPending
    
    result, err := ds.collection.InsertOne(ctx, doc)
    if err != nil {
        return err
    }
    
    doc.ID = result.InsertedID.(primitive.ObjectID)
    return nil
}

func (ds *DocumentService) GetDocument(id string) (*models.Document, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, err
    }
    
    var doc models.Document
    err = ds.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&doc)
    if err != nil {
        return nil, err
    }
    
    return &doc, nil
}

func (ds *DocumentService) UpdateDocumentStatus(id string, status models.ProcessingStatus, errorMsg string) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return err
    }
    
    update := bson.M{
        "$set": bson.M{
            "status": status,
        },
    }
    
    if status == models.StatusCompleted {
        now := time.Now()
        update["$set"].(bson.M)["processed_at"] = &now
    }
    
    if errorMsg != "" {
        update["$set"].(bson.M)["error_message"] = errorMsg
    }
    
    _, err = ds.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
    return err
}

func (ds *DocumentService) UpdateDocumentData(id string, parsedData map[string]interface{}, taxResult *models.TaxResult) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return err
    }
    
    update := bson.M{
        "$set": bson.M{
            "parsed_data": parsedData,
            "status": models.StatusCompleted,
        },
    }
    
    if taxResult != nil {
        update["$set"].(bson.M)["tax_calculation"] = taxResult
    }
    
    now := time.Now()
    update["$set"].(bson.M)["processed_at"] = &now
    
    _, err = ds.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
    return err
}

func (ds *DocumentService) ListDocuments(limit int64) ([]models.Document, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    cursor, err := ds.collection.Find(ctx, bson.M{}, nil)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(ctx)
    
    var documents []models.Document
    if err = cursor.All(ctx, &documents); err != nil {
        return nil, err
    }
    
    return documents, nil
}
