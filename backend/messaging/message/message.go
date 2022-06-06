package message

import (
	"fmt"
	"messaging/db"
	"time"
)

type Message struct {
	Id       *int64    `db:"id" json:"id"`
	Sender   int       `db:"sender_id" json:"sender_id"`
	Receiver int       `db:"receiver_id" json:"receiver_id"`
	Time     time.Time `db:"time_sent" json:"time_sent"`
	Body     string    `db:"body" json:"body"`
}

func New(sender int, receiver int, time time.Time, body string) Message {
	return Message{
		nil,
		sender,
		receiver,
		time,
		body,
	}
}

func (m Message) ToDb(db *db.Database) int64 {
	var id int64
	err := db.Client.QueryRow(fmt.Sprintf(
		"INSERT INTO messages (sender_id, receiver_id, time_sent, body) VALUES (%d, %d, '%s', '%s') RETURNING id;",
		m.Sender,
		m.Receiver,
		m.Time.Local().Format(time.RFC3339),
		m.Body)).Scan(&id)
	if err != nil {
		panic(err)
	}
	return id
}

func FromDb(db *db.Database, id int) *Message {
	var msg Message
	q := fmt.Sprintf("SELECT * FROM messages WHERE id = %d;", id)
	fmt.Println(q)
	err := db.Client.QueryRow(q).Scan(&msg.Id, &msg.Sender, &msg.Receiver, &msg.Time, &msg.Body)
	if err != nil {
		return nil
	}
	return &msg
}

func GetMessages(db *db.Database) []Message {
	var msgs []Message
	rows := db.QueryRows("SELECT * FROM messages")
	defer rows.Close()
	for rows.Next() {
		var msg Message
		rows.Scan(&msg.Id, &msg.Sender, &msg.Receiver, &msg.Time, &msg.Body)
		msgs = append(msgs, msg)
	}
	return msgs
}

func GetUserMessages(db *db.Database, id1 int, id2 int) []Message {
	var msgs []Message
	rows := db.QueryRows(fmt.Sprintf("SELECT * FROM messages WHERE sender_id = %d OR receiver_id = %d ORDER BY time_sent", id1, id2))
	defer rows.Close()
	for rows.Next() {
		var msg Message
		rows.Scan(&msg.Id, &msg.Sender, &msg.Receiver, &msg.Time, &msg.Body)
		msgs = append(msgs, msg)
	}
	return msgs
}

func DeleteMessage(db *db.Database, id int) bool {
	return db.Query(fmt.Sprintf("DELETE FROM messages WHERE id = %d", id))
}
