# Data/Models

Data/Models is where you define the core layout of the data format that you wish to use the collaborative editor with, currently there are only two supported data models, the CMS datamodel (used by the CMS frontend) and the Learning Platform datamodel (used by the learning platform).

## Creating Models
Note that in order to expose your new datamodel you must implement the `IsExposed()` method, this is to prevent passing the wrong models into the CMS functions (so hopefully this can be caught at compile time as opposed to runtime).

## Details
TODO :sunglasses: