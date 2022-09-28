module Converters

open CMSSyntax
open GhostSyntax
open GhostSyntax.Sections
open GhostSyntax.Cards

let findTextStyle (markups: Markups.markup list) (markup: Markups.markup) : bool = 
    List.exists (fun m -> m = markup) markups


let convertMarkups (markups: Markups.markup list) : textStyle = 
    {
        bold = findTextStyle markups Markups.Strong // Strong seems like a direct translation for bold despite also having a bold markup?
        italic = findTextStyle markups Markups.Emphasis // Emphasis seems like a direct translation with italics despite there being an italics markup?
        underline = false
    }


let convertToText (text: string) (styles: bool list) : text = 
    {
        data = Text text
        style = {
            bold = styles.Item 0
            italic = styles.Item 1
            underline = styles.Item 2
        }
    }


// This needs to be implemented properly once frontend is ready
let convertCallout (callout: Cards.callout) : text list = 
    [convertToText callout.calloutText [false; false; false]]


// This needs to be implemented properly once frontend is ready
let convertToggle (toggle: Cards.toggle) : text list = 
    [convertToText toggle.heading [true; false; false]; convertToText toggle.content [false; false; false]]


let convertCode (code: Cards.code) : text list = 
    [convertToText ("=== THIS IS A CODE BLOCK === \n" + code.code) [false; false; false]]


let convertCard (cards: Cards.card list) (cardIndex: int) : text list = 
    match List.tryItem cardIndex cards with
            | Option.None -> []
            | Some value -> match value with
                            | Callout callout -> convertCallout callout
                            | Toggle toggle -> convertToggle toggle
                            | Code code -> convertCode code


let rec removeMarkups (openMarkups: int list) (numClosedMarkups: int) : int list =
    match numClosedMarkups with
        | 0 -> openMarkups
        | _ -> removeMarkups (List.tail openMarkups) (numClosedMarkups - 1)


let retrieveMarkups (markups: Markups.markup list) (indices: int list) : Markups.markup list = 
    List.map (fun index -> List.item index markups) indices


let extractValue (markups: Markups.markup list) = function
    | StringValue x -> 
        let combinedLinks = markups
                                |> List.map (function | Markups.Link link -> link.url | _ -> "")
                                |> List.fold (+) ""
        if combinedLinks <> "" then x + " (" + combinedLinks + ")" else x
    | AtomIndex _ -> System.Environment.NewLine

let convertValue (sectionBlock : sectionBlock) (openMarkups : Markups.markup list) : textType =
    Text <| extractValue openMarkups sectionBlock.value


let convertSectionBlocks (markups: Markups.markup list) (sectionBlock: list<sectionBlock>) : text list = 
    let rec convertSectionBlock (sections: list<sectionBlock>) (openMarkups : int list) : text list = 
        match sections with 
            | [] -> []
            | x :: xs -> 
                let openMarkups = List.append openMarkups x.openMarkups 
                let retrievedMarkups = retrieveMarkups markups openMarkups
                {
                    data = convertValue x retrievedMarkups
                    style = convertMarkups retrievedMarkups
                } :: (convertSectionBlock xs (removeMarkups openMarkups x.numClosedMarkups))
    
    convertSectionBlock sectionBlock []


let convertSection (cards: Cards.card list) (markups: Markups.markup list) (section: Sections.section) : paragraph = 
    {
        paragraphAllign = Center
        children = match section.blocks with
                    | Section sectionBlock -> convertSectionBlocks markups sectionBlock
                    | CardReference index -> convertCard cards index
    }


let GhostToCms (document: GhostDocument) : CMSDocument = 
    {
        documentName = "replace me"
        documentId = 0
        content = List.map (convertSection document.Cards document.Markups) document.Sections
    }

