package algorithms

// Config for some of our algorithms
// controls the minimum size of a job
// aka: the job that isnt broken up into subproblems
// computed concurrently
const concurrentBatchSize int = 2000

// threshold before which the concurrent implementation
// of an algorithm starts running
const concurrencyThreshold int = 2000

// limits the amount of go routines that can be
// spawned for a concurrent computation, the limit
// prevents excessive context switching :)
const concurrentSpawnLimit int = 8
