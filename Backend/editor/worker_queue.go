package editor

import "sync"

type WorkerQueue struct {
	head *node
	tail *node

	queueSize     int
	queueHasItems sync.Cond
	queueLock     sync.Mutex

	// to prevent excessive allocation of
	// node objects we just maintain a memory pool
	// of them :D
	nodePool sync.Pool
}

type empty struct{}

type node struct {
	next *node
	prev *node

	workHandle chan func()
	killHandle chan empty
}

// NewConcurrentQueue creates a queue with the first item being "item"
func NewWorkerQueue(workHandle chan func(), killHandle chan empty) *WorkerQueue {
	entryNode := &node{
		next:       nil,
		workHandle: workHandle,
		killHandle: killHandle,
	}

	return &WorkerQueue{
		head:          entryNode,
		tail:          entryNode,
		queueLock:     sync.Mutex{},
		queueHasItems: sync.Cond{},
		nodePool: sync.Pool{
			New: func() any {
				return &node{
					prev: nil,
					next: nil,
				}
			},
		},
	}
}

// Creates a new worker in our worker queue, alerts anyone waiting
// on the worker too
func (queue *WorkerQueue) NewWorker(workHandle chan func(), killHandle chan empty) {
	newEntry := queue.nodePool.Get().(*node)

	newEntry.workHandle = workHandle
	newEntry.killHandle = killHandle

	queue.pushWorker(newEntry)
}

func (queue *WorkerQueue) pushWorker(newEntry *node) {
	queue.queueLock.Lock()
	if queue.head != nil {
		queue.head.prev = newEntry
	}
	newEntry.next = queue.head
	queue.head = newEntry

	if queue.tail == nil {
		queue.tail = newEntry
	}

	// if the queue was empty just alert waiting
	// on it to fill up that they can wakeup now
	queue.queueHasItems.Broadcast()
	queue.queueSize += 1
	queue.queueLock.Unlock()
}

// WaitForWorker basically just waits for the queueSize to increase
// and then claims a worker when it does
func (queue *WorkerQueue) GetNextAvaliableWorker() (chan func(), chan empty) {
	// wait until a worker is avaliable

	queue.queueLock.Lock()
	for queue.queueSize == 0 {
		queue.queueLock.Unlock()
		queue.queueHasItems.Wait()
		queue.queueLock.Lock()
	}

	// if we're here that means a worker is avaliable for us to snag
	workHandle, killHandle := queue.GetWorker(true)
	queue.queueLock.Unlock()

	return workHandle, killHandle
}

// just pop a worker from the tail of the queue
// code is a bit messy due to the weHaveLock flag
func (queue *WorkerQueue) GetWorker(weHaveLock bool) (chan func(), chan empty) {

	if !weHaveLock {
		queue.queueLock.Lock()
	}

	if queue.head == nil && queue.tail == nil {
		return nil, nil
	}

	toReturn := queue.tail
	replacement := toReturn.prev

	queue.tail = replacement
	queue.queueSize -= 1
	replacement.next = nil

	if !weHaveLock {
		queue.queueLock.Unlock()
	}

	// after returning return the node to the node pool
	// pooling just reduces allocations in the worker queue
	defer func() {
		// zero out the appropriate feilds for safety
		toReturn.next = nil
		toReturn.prev = nil
		toReturn.workHandle = nil
		toReturn.killHandle = nil
		queue.nodePool.Put(toReturn)
	}()

	return toReturn.workHandle, toReturn.killHandle
}
