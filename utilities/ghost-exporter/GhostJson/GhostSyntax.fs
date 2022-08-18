module GhostSyntax

// Note to the reader?:
//  - For documentation on the <!> and <*> operators see the FSharpPlus documentation on monads
//  - map is also from FSharpPlus

open Fleece
open Fleece.Newtonsoft
open FSharpPlus
open System


module Markups = 
    type link = { linkType: string; url: string }
    type markup = 
        | Link of link
        | Code
        | Emphasis
        | Strong
    with
        static member OfJson json = 
            match json with
            | JArray o ->
                match List.ofSeq o with
                | (JString "a")         :: (JString lType) :: (JString url) :: [] -> Decode.Success (Link { linkType = lType; url = url })
                | (JString "code")      :: [] -> Decode.Success Code
                | (JString "em")        :: [] -> Decode.Success Emphasis
                | (JString "strong")    :: [] -> Decode.Success Strong
                | _ -> Decode.Fail.invalidValue json "failed to parse into markup"

            | _ -> Decode.Fail.arrExpected json

module Cards = 
    // Callout cards can be directly translated into CMS paragraph blocks
    type callout = 
        { calloutEmoji: string; calloutText: string; backgroundColour: string }
    with
        static member OfJson = function 
            | JObject o -> 
                (fun emoji text background -> { calloutEmoji = emoji; calloutText = text; backgroundColour = background })
                <!> (o .@ "calloutEmoji") 
                <*> (o .@ "calloutText") 
                <*> (o .@ "backgroundColor")
            | o -> Decode.Fail.invalidValue o "failed to parse into callout card" 


    // Toggle cards can be directly translated into CMS paragraph blocks
    type toggle = 
        { heading: string; content: string }
    with
        static member OfJson = function 
            | JObject o -> (fun heading content -> { heading = heading; content = content }) <!> (o .@ "heading") <*> (o .@ "content")
            | o -> Decode.Fail.invalidValue o "failed to parse into toggle card"


    // Code cards can be directly translated into CMS code blocks
    type code = 
        { language: string; code: string }
    with
        static member OfJson json = 
            match json with
            | JObject o -> (fun language code -> { language = language; code = code}) <!> (o .@ "language") <*> (o .@ "code")
            | o -> Decode.Fail.invalidValue o "failed to parse into code card"


    // Finally the card type is a discrminated union of all the existing card type supported by Ghost
    type card = 
        | Callout of callout
        | Toggle of toggle
        | Code of code
    with
        static member OfJson json = 
            match json with
            | JArray o ->
                match List.ofSeq o with
                | (JString "callout") :: (cardObject: Encoding) :: [] -> Callout <!> (callout.OfJson cardObject)
                | (JString "toggle")  :: (cardObject: Encoding) :: [] -> Toggle <!> (toggle.OfJson cardObject)
                | (JString "code")    :: (cardObject: Encoding) :: [] -> Code <!> (code.OfJson cardObject)
                | _ -> Decode.Fail.invalidValue json "failed to parse into card"
            | _ -> Decode.Fail.arrExpected json


module Sections = 
    type sectionTag =
    | Paragraph
    | Heading

    // Specialised parsers since this library doesn't seem to give us any :(((((((
    // Might stack overflow on large lists but I dont see us ever having to deal with that, if stack overflows are an issue just optimise to be tail call recursive
    let rec parseListInner (parser: Encoding -> Result<'a, DecodeError>) arr : Result<'a list, DecodeError> =
        match arr with
        | x :: xs -> match parseListInner parser xs with
                        | Ok arr -> (fun parsedValue -> parsedValue :: arr) <!> (parser x)
                        | Error x -> Error x
        | [] -> Ok []
    
    let parseList parser arr = parseListInner parser (List.ofSeq arr)
    let parseNumberList = parseList (function | JNumber x -> Ok (Decimal.ToInt32 x) | x -> Decode.Fail.numExpected x) 

    // Individual styling rules for a section
    type sectionBlock = {
        openMarkups: int list;
        numClosedMarkups: int;
        value: string;
    } with
        static member OfJson json =
            match json with
            | JArray o -> match List.ofSeq o with
                            | (JNumber 0m) :: (JArray openMarkups) :: (JNumber numClosedMarkups) :: (JString text) :: [] ->
                                (fun openMarkups numClosedMarkups text -> { openMarkups = openMarkups; numClosedMarkups = numClosedMarkups; value = text })
                                <!> (parseNumberList openMarkups)
                                <*> (Ok (Decimal.ToInt32 numClosedMarkups))
                                <*> (Ok text)
                            | _ -> Decode.Fail.invalidValue json "failed to parse into section block"

            | json -> Decode.Fail.arrExpected json

    let parseSectionBlockList = parseList sectionBlock.OfJson 

    // Sections are the core of the ghost mobiledoc format, they're what will directly dictate the structure of the exported CMS json
    type section = {
        tag: sectionTag;
        blocks: sectionBlock list;
    } with
        static member OfJson json =
            match json with
            | JArray o -> match List.ofSeq o with
                            | (JNumber 1m) :: (JString "p") :: (JArray subsections) :: [] -> (fun sections -> { tag = Paragraph; blocks = sections }) <!> (parseSectionBlockList subsections)
                            | (JNumber 1m) :: (JString "h2") :: (JArray subsections) :: [] -> (fun sections -> { tag = Heading; blocks = sections }) <!> (parseSectionBlockList subsections)
                            | _ -> Decode.Fail.invalidValue json "failed to parse into sections"
            | json -> Decode.Fail.arrExpected json



type GhostDocument = {
    Cards: Cards.card list
    Markups: Markups.markup list
    Sections: Sections.section list
} with 
    static member OfJson json = 
        match json with
        | JObject o -> 
            monad {
                let! markups = o .@ "markups"
                let! cards = o .@ "cards"
                let! sections = o .@ "sections"

                return {
                    Cards = cards
                    Markups = markups
                    Sections = sections
                }
            }
        | _ -> Decode.Fail.objExpected json
