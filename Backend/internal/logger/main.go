package logger

import (
	"log"
	"sync"
)

type Log struct {
	startingMessage string
	logBuffer       [][]byte
	logLock         sync.Mutex
}

// OpenLog creates a new log to be passed
// down the call chain, u can flush the logBuffer with close or flush
func OpenLog(startingMessage string) *Log {
	return &Log{
		startingMessage: startingMessage,
		logBuffer:       [][]byte{},
		logLock:         sync.Mutex{},
	}
}

// Write writes to an open log
func (l *Log) Write(log []byte) {
	l.logLock.Lock()
	l.logBuffer = append(l.logBuffer, log)
	l.logLock.Unlock()
}

// flush flushes the buffer using Go's inbuilt logging library
func (l *Log) Flush() {
	l.logLock.Lock()
	log.Printf("== %s ==\n", l.startingMessage)
	for _, line := range l.logBuffer {
		log.Printf("	%s", line)
	}
	l.logLock.Unlock()
}

// Close closes the buffer, basically just flushing it
func (l *Log) Close() {
	l.Flush()
	log.Printf("== log end ==\n")
}
