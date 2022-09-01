module CMSSyntax

open Fleece
open Newtonsoft.Json
open Fleece.Newtonsoft
open Fleece.Newtonsoft.Operators

// possible allignment of text blocks
type alignment = 
| Left
| Right
| Center
| None
with
    static member ToJson (x: alignment) = 
        match x with
        | Left -> JString "left"
        | Right -> JString "right"
        | Center -> JString "center"
        | None -> jobj []

// possible text stylings
type textStyle = 
| Bold
| Italic
| Underline
| None
with
    static member ToJson (x: textStyle) = 
        match x with
        | Bold -> JString "bold"
        | Italic -> JString "italic"
        | Underline -> JString "underline"
        | None -> jobj []

// possible types for textTypes
type textType = 
| Text of string
| Url of string
with
    static member ToJson (x: textType) =
        match x with 
        | Text y -> JString y
        | Url y -> JString y


// general outline of a text block
type text = {
    data: textType;
    style: textStyle;
} with
    static member ToJson (x: text) = 
        jobj [
            "text" .= x.data
            "style" .= x.style
        ]

// paragraphs are just chunks of text
type paragraph = {
    paragraphAllign: alignment;
    children: text list
} with
    static member ToJson (x: paragraph) = 
        jobj [
            "align" .= x.paragraphAllign
            "children" .= x.children
        ]

// document is just a list of content blocks
type CMSDocument = {
    documentName: string;
    documentId: int;
    content: paragraph list
} with
    static member ToJson (x: CMSDocument) = 
        jobj [
            "document_name" .= x.documentName
            "document_id" .= x.documentId
            "content" .= x.content
        ]