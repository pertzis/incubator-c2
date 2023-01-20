package server

import (
	"fmt"
	"log"
	"net"
	"strconv"
	"strings"
)

func Listen() {
	server, err := net.Listen("tcp", "0.0.0.0:8081")
	if err != nil {
		log.Fatal("Could not start server:", err)
	}

	defer server.Close()
	for {
		conn, err := server.Accept()
		if err != nil {
			fmt.Println("Could not accept client:", err)
		}
		conn.Write([]byte("Hello, world!\r\n"))
		for {
			receive(conn)
		}
	}

}

func receive(conn net.Conn) string {

	messageSize := make([]byte, 10)

	conn.Read(messageSize)
	fmt.Println("Message Size:", string(messageSize))
	intMessageSize, err := strconv.Atoi(strings.TrimRight(string(messageSize), " "))
	if err != nil {
		fmt.Println("Error: could not decode message header.")
		return ""
	}

	message := make([]byte, intMessageSize)
	conn.Read(message)

	return string(message)

}
