package algorithms

// Config for some of our algorithms
// controls the minimum size of a job
// aka: the job that isnt broken up into subproblems
// computed concurrently
const concurrentBatchSize int = 1000
