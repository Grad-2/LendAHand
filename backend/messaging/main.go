package main

import (
	"fmt"
	"messaging/db"
	"messaging/message"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	db := db.NewFromEnv()
	db.QueryFromFile("db/queries/create_tables.sql")

	msg := router.Group("/message")

	msg.GET("", func(c *gin.Context) {
		msgs := message.GetMessages(&db)
		fmt.Println(msgs)
		c.JSON(200, msgs)
	})

	msg.POST("", func(c *gin.Context) {
		var msg message.Message
		c.BindJSON(&msg)

		id := msg.ToDb(&db)
		msg.Id = &id
		c.JSON(200, msg)
	})

	msg.GET(":id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"status": "bad request"})
		}
		msg := message.FromDb(&db, id)
		if msg != nil {
			c.JSON(200, msg)
		}
		c.JSON(400, gin.H{"status": "bad request"})
	})

	msg.DELETE(":id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"status": "bad request"})
		}
		if message.DeleteMessage(&db, id) {
			c.JSON(200, nil)
		} else {
			c.JSON(400, gin.H{"status": "bad request"})
		}
	})

	router.GET("/chat/:sid/:rid", func(c *gin.Context) {
		sid, serr := strconv.Atoi(c.Param("sid"))
		rid, rerr := strconv.Atoi(c.Param("rid"))
		if serr != nil || rerr != nil {
			c.JSON(400, gin.H{"status": "bad request"})
		}
		msgs := message.GetUserMessages(&db, sid, rid)
		c.JSON(200, msgs)
	})

	router.Run(fmt.Sprintf(":%s", os.Getenv("MSG_PORT")))
}
