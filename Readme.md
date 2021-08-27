# DiffSync

Experimental respository for the CSESoc CMS, usage is simple; to build and run type

<b>Note: the code is ugly, the design is hacky but its just a prototype to flesh out ideas.</b>
```sh
make start
```
And go to `http://localhost:8080?document={what ever}`, other clients can connect at this same URL and start communicating :)
Live previews are served via: `http://localhost:8080/preview?document={what ever}`

# TODO
 - [ ] Reimplement diffmatchpatch from scracth instead of relying on a library
 - [ ] the library is rather outdated

## Resources
The algorithm being used is an "uncommon?" algorithm so some papers outlining many of the algos used can be found here
 - [Differential Synchronisation Algorithm](https://neil.fraser.name/writing/sync/eng047-fraser.pdf)
 - [Myer's Difference Algorithm](http://www.xmailserver.org/diff2.pdf)
 - [A cool blog post](https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/)
 - [String Difference Strategies](https://neil.fraser.name/writing/diff/)