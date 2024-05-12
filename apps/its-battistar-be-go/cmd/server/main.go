package main

import "log/slog"

func main() {
	// Start the server
	// println("Hello, World!")

	for i := 0; i < 10; i++ {
		slog.Info("Hello, World!")
	}
}
