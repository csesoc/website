module CMSSyntax

open Fleece

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
type textStyle = {
    bold: bool;
    italic: bool;
    underline: bool;
}

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
    textSize: int
} with
    static member ToJson (x: text) = 
        jobj [
            "text" .= x.data
            "bold" .= x.style.bold
            "italic" .= x.style.italic
            "underline" .= x.style.underline
            "textSize" .= x.textSize
        ]

// paragraphs are just chunks of text
type paragraph = {
    paragraphAllign: alignment;
    children: text list
} with
    static member ToJson (x: paragraph) = 
        jobj [
            "type" .= "paragraph"
            "align" .= x.paragraphAllign
            "children" .= x.children
        ]

// document is just a list of content blocks
type CMSDocument = {
    documentName: string;
    documentId: int;
    content: paragraph list list
} with
    static member ToJson (x: CMSDocument) =
        // Create a paragraph block for the heading
        let titleBlock = [{
            paragraphAllign = Center
            children = [{
                data = Text x.documentName
                textSize = 30
                style = {
                    bold = true
                    italic = false
                    underline = true
                }
            }]
        }]

        jobj [
            "content" .= titleBlock :: x.content
        ]