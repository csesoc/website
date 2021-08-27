package diffsyncService

import (
	state "DiffSync/internal/state"
	"sync"
)

type ConcurrentMap struct {
	sync.RWMutex
	payload map[string]*state.Document
}

func NewConcurrentMap() *ConcurrentMap {
	return &ConcurrentMap{
		payload: make(map[string]*state.Document),
	}
}

func (cmap *ConcurrentMap) Read(key string) (*state.Document, bool) {
	cmap.Lock()
	defer cmap.Unlock()

	val, ok := cmap.payload[key]
	return val, ok
}

func (cmap *ConcurrentMap) Write(key string, val *state.Document) {
	cmap.Lock()
	defer cmap.Unlock()
	cmap.payload[key] = val
}

func (cmap *ConcurrentMap) Delete(key string) {
	cmap.Lock()
	defer cmap.Unlock()

	delete(cmap.payload, key)
}
