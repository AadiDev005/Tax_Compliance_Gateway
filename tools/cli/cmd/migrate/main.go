package main

import (
    "flag"
    "log"
    "os"

    "github.com/golang-migrate/migrate/v4"
    _ "github.com/golang-migrate/migrate/v4/database/postgres"
    _ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
    log.Printf("Raw arguments: %v", os.Args)

    if len(os.Args) < 2 || os.Args[1] != "migrate" {
        log.Fatal("Usage: tax-cli migrate [--postgres-url=<url>] [--migration-path=<path>]")
    }

    var postgresURL, migrationPath string
    flag.StringVar(&postgresURL, "postgres-url", "", "PostgreSQL connection URL")
    flag.StringVar(&migrationPath, "migration-path", "/Users/adityatiwari/Downloads/Tax_Compliance_Gateway/data/migrations/postgres", "Path to migration files")

    if err := flag.CommandLine.Parse(os.Args[2:]); err != nil {
        log.Fatalf("Flag parsing failed: %v", err)
    }

    log.Printf("Parsed postgres-url: %s", postgresURL)
    log.Printf("Parsed migration-path: %s", migrationPath)

    if postgresURL == "" {
        log.Fatal("postgres-url is required")
    }

    m, err := migrate.New("file://"+migrationPath, postgresURL)
    if err != nil {
        log.Fatalf("Migration init failed: %v", err)
    }

    if err := m.Up(); err != nil {
        if err == migrate.ErrNoChange {
            log.Println("No new migrations to apply")
            return
        }
        log.Fatalf("Migration failed: %v", err)
    }
    log.Println("Migrations applied successfully")
}
