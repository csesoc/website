package main

import (
	"errors"
	"sync"
	"time"
)

// general cache configuration
const (
	entryLifespan = 10 * time.Minute
)

// responseCache is maintains a cache of the responses returned by the FB API
// entries are invalidated from the cache once the expiryTime has passed
type responseCache struct {
	cachedResp []byte
	cacheLock  sync.RWMutex
	expiryTime time.Time
}

// HasExpired determines if the entry in the response cache is still valid
func (rc *responseCache) HasExpired() bool {
	rc.cacheLock.RLock()
	defer rc.cacheLock.RUnlock()

	return rc.expiryTime.Before(time.Now())
}

// Read reads the value of the response cache and returns an error if the entry has expired
func (rc *responseCache) Read() ([]byte, error) {
	rc.cacheLock.RLock()
	defer rc.cacheLock.RUnlock()

	if rc.HasExpired() {
		return nil, errors.New("entry in the cached has expired")
	}

	return rc.cachedResp, nil
}

// RenewWith refreshes the contents of the cache with the new value and sets the expiry time
//	the expiry time is computed time.Now() + entryLifeSpan
func (rc *responseCache) RenewWith(newResponse []byte) {
	rc.cacheLock.Lock()
	defer rc.cacheLock.Unlock()

	rc.cachedResp = newResponse
	rc.expiryTime = time.Now().Add(entryLifespan)
}

// Renew completely refreshes the expiry time for the value in the cache
func (rc *responseCache) Renew() {
	rc.cacheLock.Lock()
	defer rc.cacheLock.Unlock()

	rc.expiryTime = time.Now().Add(entryLifespan)
}
