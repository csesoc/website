package logger

import (
	"fmt"
	"log"
	"strings"
	"sync"
)

type Log struct {
	startingMessage string
	logBuffer       strings.Builder
	logLock         sync.Mutex
}

// OpenLog creates a new log to be passed
// down the call chain, u can flush the logBuffer with close or flush
func OpenLog(startingMessage string) *Log {
	return &Log{
		startingMessage: startingMessage,
		logBuffer:       strings.Builder{},
		logLock:         sync.Mutex{},
	}
}

// Write writes to an open log
func (l *Log) Write(log string) {
	l.logLock.Lock()
	// TODO: investigate if this is slower than just maintaining an array of byte buffers
	l.logBuffer.WriteString(fmt.Sprintf("	%s\n", log))
	l.logLock.Unlock()
}

// flush flushes the buffer using Go's inbuilt logging library
func (l *Log) Flush() {
	l.logLock.Lock()
	log.Printf("== %s ==\n", l.startingMessage)
	log.Print(l.logBuffer.String())
	l.logLock.Unlock()
}

// Close closes the buffer, basically just flushing it
func (l *Log) Close() {
	l.Flush()
	log.Printf("== log end ==\n")
}
