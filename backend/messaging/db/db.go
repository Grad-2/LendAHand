package db

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"os"

	_ "github.com/lib/pq"
)

type DbStruct[T interface{}] interface {
	QueryAs(T, string)
}

type Database struct {
	Client *sql.DB
}

func New(db_name string, username string, password string) Database {
	conn_str := fmt.Sprintf("postgres://%s:%s@%s?sslmode=disable", username, password, db_name)
	db, err := sql.Open("postgres", conn_str)
	if err != nil {
		panic(err)
	}
	return Database{
		Client: db,
	}
}

func NewFromEnv() Database {
	db_name := os.Getenv("POSTGRES_DB")
	user := os.Getenv("POSTGRES_USER")
	pw := os.Getenv("POSTGRES_PASSWORD")
	return New(db_name, user, pw)
}

func (db Database) QueryFromFile(file string) bool {
	q, err := ioutil.ReadFile(file)
	if err != nil {
		return false
	}
	return db.Query(string(q))
}

func (db Database) Query(query string) bool {
	_, err := db.Client.Exec(query)
	return err == nil
}

func (db Database) QueryRows(query string) *sql.Rows {
	rows, err := db.Client.Query(query)
	if err != nil {
		return nil
	}
	return rows
}
