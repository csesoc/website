package diffsync

import (
	"sync"
)

type ConcurrentMap struct {
	sync.RWMutex
	payload map[string]*Document
}

func NewConcurrentMap() *ConcurrentMap {
	return &ConcurrentMap{
		payload: make(map[string]*Document),
	}
}

func (cmap *ConcurrentMap) Read(key string) (*Document, bool) {
	cmap.Lock()
	defer cmap.Unlock()

	val, ok := cmap.payload[key]
	return val, ok
}

func (cmap *ConcurrentMap) Write(key string, val *Document) {
	cmap.Lock()
	defer cmap.Unlock()
	cmap.payload[key] = val
}

func (cmap *ConcurrentMap) Delete(key string) {
	cmap.Lock()
	defer cmap.Unlock()

	delete(cmap.payload, key)
}
