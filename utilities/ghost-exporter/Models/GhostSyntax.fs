module GhostSyntax

// Note to the reader?:
//  - For documentation on the <!> and <*> operators see the FSharpPlus documentation on monads
//  - map is also from FSharpPlus

open Fleece
open Fleece.Newtonsoft
open FSharpPlus
open System


module Markups = 
    let Success = Decode.Success
    let Invalid = Decode.Fail.invalidValue

    type link = { linkType: string; url: string }
    type markup = 
        | Link of link
        | Code
        | Emphasis
        | Strong
    with
        static member OfJson json = 
            match json with
            | JArray arr -> 
                match List.ofSeq arr with
                    | [(JString "code")] -> Success Code
                    | [(JString "em")] -> Success Emphasis
                    | [(JString "strong")] -> Success Strong
                    | [(JString "a"); (JArray o)] -> 
                        match List.ofSeq o with 
                            | [(JString lType); (JString url)] -> Success <| Link { linkType = lType; url = url }
                            | _ -> Invalid json "failed to parse into reference markup"
                    | _ -> Invalid json "failed to parse into markup"
            | o -> Decode.Fail.arrExpected o


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
                | [JString "callout"; cardObject: Encoding] -> Callout <!> (callout.OfJson cardObject)
                | [JString "toggle"; cardObject: Encoding] -> Toggle <!> (toggle.OfJson cardObject)
                | [JString "code"; cardObject: Encoding] -> Code <!> (code.OfJson cardObject)
                | _ -> Decode.Fail.invalidValue json "failed to parse into card"
            | _ -> Decode.Fail.arrExpected json


module Sections = 
    type sectionTag =
        | Paragraph
        | Heading
        | Card

    // Specialised parsers since this library doesn't seem to give us any :(((((((
    // Might stack overflow on large lists but I dont see us ever having to deal with that, if stack overflows are an issue just optimise to be tail call recursive
    let rec parseListInner (parser: Encoding -> Result<'a, DecodeError>) arr : Result<'a list, DecodeError> =
        match arr with
        | [] -> Ok []
        | x :: xs -> match parseListInner parser xs with
                        | Ok arr -> (fun parsedValue -> parsedValue :: arr) <!> (parser x)
                        | Error x -> Error x
    
    let parseList parser arr = parseListInner parser (List.ofSeq arr)
    let parseNumberList = parseList (function | JNumber x -> Ok (Decimal.ToInt32 x) | x -> Decode.Fail.numExpected x) 

    // Individual styling rules for a section
    type sectionType = 
        | AtomIndex of int
        | StringValue of string

    type sectionBlock = {
        openMarkups: int list;
        numClosedMarkups: int;
        value: sectionType;
    } with
        static member createSectionBlock = fun openMarkups numClosedMarkups value -> { openMarkups = openMarkups; numClosedMarkups = numClosedMarkups; value = value }
        static member OfJson json =
            match json with
            | JArray o -> match List.ofSeq o with
                            | [JNumber sectionType; JArray openMarkups; JNumber numClosedMarkups; value] ->
                                let block = sectionBlock.createSectionBlock <!> (parseNumberList openMarkups) <*> (Ok (Decimal.ToInt32 numClosedMarkups))
                                match (sectionType, value) with
                                    | (0m, JString text) -> block <*> (Ok <| StringValue text)
                                    | (1m, JNumber atomIndex) -> block <*> (Ok <| AtomIndex (Decimal.ToInt32 atomIndex))
                                    | _ -> Decode.Fail.invalidValue json "failed to parse section type"

                            | _ -> Decode.Fail.invalidValue json "failed to parse into section block"

            | json -> Decode.Fail.arrExpected json

    let parseSectionBlockList = parseList sectionBlock.OfJson
    let parseSectionBlockListInner = parseListInner sectionBlock.OfJson

    type blockValue =
        | Section of list<sectionBlock>
        | CardReference of int

    // Sections are the core of the ghost mobiledoc format, they're what will directly dictate the structure of the exported CMS json
    type section = {
        tag: sectionTag;
        blocks: blockValue;
    } with
        static member createSection = fun sections tag -> { tag = tag; blocks = Section sections }
        static member OfJson json =
            match json with
            | JArray o -> match List.ofSeq o with
                            | [JNumber 10m; JNumber x] -> Decode.Success { tag = Card; blocks = CardReference <| Decimal.ToInt32 x }
                            | [JNumber 3m; JString sectionType; JArray subsectionArray] ->
                                // this is so hacky im sorry :(, please fix this later
                                let rec sequenceSubsections = function
                                    | [] -> Ok []
                                    | x :: xs -> 
                                        match x with
                                        | JArray inner -> match parseSectionBlockList inner with
                                                            | Ok arr -> (fun parsedValue -> List.append arr parsedValue) <!> (sequenceSubsections xs)
                                                            | Error x -> Error x
                                        | o -> Decode.Fail.arrExpected o

                                section.createSection <!> (sequenceSubsections <| List.ofSeq subsectionArray) <*> (Ok Paragraph)

                            | [JNumber 1m; JString sectionType; JArray subsections] ->
                                let partialSection = section.createSection <!> (parseSectionBlockList subsections)
                                match sectionType with
                                    | "p" -> partialSection <*> (Ok Paragraph)
                                    | "h2" | "h3" | "h4" -> partialSection <*> (Ok Heading)
                                    | _ -> Decode.Fail.invalidValue json "failed to parse into sections"

                            |  _ -> Decode.Fail.invalidValue json "failed to parse into sections"
            | json -> 
                printf "%A" json
                Decode.Fail.arrExpected json


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
