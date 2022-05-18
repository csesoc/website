package editor

import "sync"

// worker pool is a simple structure for the management of a pool of goroutines
// the reason we have this is because we spin up a goroutine for each incoming keystroke from the client
// so my suspicion is that the overhead of allocating a stack and then deallocating it on each keystroke
// is rather costly (despite goroutines being rather lightweight)
// TODO: in the future benchmark the actual impact of just spinning a goroutine on each keystroke
// 		and remove this if it isnt actually as bad as suspected
type WorkerPool struct {
	poolSize          int
	avaliableRoutines *WorkerQueue

	poolLock sync.Mutex
}

// Creates a new worker pool
func NewWorkerPool() *WorkerPool {
	workHandleOne := make(chan func())
	killHandleOne := make(chan empty)

	workHandleTwo := make(chan func())
	killHandleTwo := make(chan empty)

	pool := &WorkerPool{
		poolSize:          2,
		avaliableRoutines: NewWorkerQueue(workHandleOne, killHandleOne),
		poolLock:          sync.Mutex{},
	}

	pool.avaliableRoutines.NewWorker(workHandleTwo, killHandleTwo)

	// start the 2 new worker threads :D
	go pool.workerbody(workHandleOne, killHandleOne)
	go pool.workerbody(workHandleTwo, killHandleTwo)

	return pool
}

// Schedule work is a blocking call that waits for a worker
// to free so that they can take our work
func (pool *WorkerPool) ScheduleWork(work func()) {
	// blocks until we have a worker
	workHandle, _ := pool.avaliableRoutines.GetNextAvaliableWorker()
	workHandle <- work
}

// RemoveWorker decreases the amount of avaliable workers by 1
func (pool *WorkerPool) RemoveWorker() {
	// just fetch an avaliable worker and terminate it :D
	_, killHandle := pool.avaliableRoutines.GetNextAvaliableWorker()
	killHandle <- empty{}

	pool.poolLock.Lock()
	pool.poolSize -= 1
	pool.poolLock.Unlock()
}

// AddWorker increase the number of workers by 1
func (pool *WorkerPool) AddWorker() {
	workHandle := make(chan func())
	killHandle := make(chan empty)

	pool.avaliableRoutines.NewWorker(workHandle, killHandle)
	go pool.workerbody(workHandle, killHandle)

	pool.poolLock.Lock()
	pool.poolSize += 1
	pool.poolLock.Unlock()
}

func (pool *WorkerPool) GetPoolSize() int {
	pool.poolLock.Lock()
	size := pool.poolSize
	pool.poolLock.Unlock()

	return size
}

// workerbody is the code for a worker routine
// it simply just spins in a loop waiting for work
// the termination pipe is a channel that a kill signal can be sent down
func (pool *WorkerPool) workerbody(workHandle chan func(), killHandle chan empty) {
	for {
		select {
		case work := <-workHandle:
			// do the work and then return ourselves to the worker pool
			work()
			pool.avaliableRoutines.NewWorker(workHandle, killHandle)

		case <-killHandle:
			// decrement the amount of avaliable workers and die
			pool.poolLock.Lock()
			pool.poolSize -= 1
			pool.poolLock.Unlock()
			return

		default:
			// do nothing
		}
	}
}
