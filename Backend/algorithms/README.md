# Algorithms

This is a small package that contains many of the algorithms used by specifically the editor, it is its own package so that it can be cross compiled with the `GOOS=JS` and web-assembly target and inserted into the frontend.

## WASM Frontend
This package is cross-compiled to target WASM, this exposes all these algorithms to the JS client to prevent re-implementation, the algorithms are primarily used for the diff/match/patch operations for the differential synchronistaion algorithm.

## Resources
Our editor uses quite a few algorithms so below is a list of resources you can use to learn about them and hopefully contribute to the editor :)
 - [Differential Synchronisation Algorithm](https://neil.fraser.name/writing/sync/eng047-fraser.pdf)
 - [Myer's Difference Algorithm](http://www.xmailserver.org/diff2.pdf)
 - [A cool blog post](https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/)
 - [String Difference Strategies](https://neil.fraser.name/writing/diff/)
