module Converters

open CMSSyntax
open GhostSyntax

let GhostToCms (document: GhostDocument) : CMSDocument = 
    {
        documentName = "replace me"
        documentId = 0
        content = []
    }