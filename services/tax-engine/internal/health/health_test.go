package health

import (
    "net/http"
    "net/http/httptest"
    "testing"
    "github.com/gin-gonic/gin"
)

func TestHealthHandler(t *testing.T) {
    gin.SetMode(gin.TestMode)
    router := gin.Default()
    router.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"status": "healthy"})
    })

    req, _ := http.NewRequest("GET", "/health", nil)
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    if w.Code != http.StatusOK {
        t.Errorf("Expected status OK, got %d", w.Code)
    }

    expectedBody := `{"status":"healthy"}`
    if w.Body.String() != expectedBody {
        t.Errorf("Expected body %s, got %s", expectedBody, w.Body.String())
    }
}
