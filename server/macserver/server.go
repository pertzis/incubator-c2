package macserver

import (
	"fmt"
	"log"
	"net"
	"os"
	"runtime"
	"strconv"
	"strings"
)

var DELIM string = "<|!|>"

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
		go handleClient(conn)
	}

}

func handleClient(conn net.Conn) {
	fmt.Printf("[%s] Connected\r\n", conn.RemoteAddr())
	for {
		message, err := receive(conn)
		if err != nil {
			fmt.Println("Failed to receive!")
			return
		}
		split_message := strings.Split(message, DELIM)
		command := split_message[0]

		fmt.Printf("[%s] [RECEIVED] %s\r\n", conn.RemoteAddr(), command)

		switch command {
		case "get_pc_info":
			var os_version string
			hostname, _ := os.Hostname()
			ipAddress := strings.Split(conn.LocalAddr().String(), ":")[0]
			os_version = runtime.GOOS

			parameters := []string{command, hostname, ipAddress, os_version}

			send(strings.Join(parameters, DELIM), conn)
		}
	}
}

func receive(conn net.Conn) (string, error) {

	messageSize := make([]byte, 10)

	conn.Read(messageSize)
	intMessageSize, err := strconv.Atoi(strings.TrimRight(string(messageSize), " "))
	if err != nil {
		return "", err
	}

	message := make([]byte, intMessageSize)
	conn.Read(message)

	return string(message), nil

}

func send(message string, conn net.Conn) error {
	finalMessage := []byte(fmt.Sprintf("%-10d%s", len(message), message))
	_, err := conn.Write(finalMessage)
	return err
}
