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
            bold = false
            italic = false
            underline = false
        } // When we inevitably switch to lists of styles we can add an additional parameter to this function to pass in the styles
    }

// This needs to be implemented properly once frontend is ready
let convertCallout (callout: Cards.callout) : text list = 
    [convertToText callout.text [false; false; false]]

// This needs to be implemented properly once frontend is ready
let convertToggle (toggle: Cards.toggle) : text list = 
    [convertToText toggle.heading [true; false; false]; convertToText toggle.body [false; false; false]]


let convertCode (code: Cards.code) : text list = 
    [convertToText code.code [false; false; false]]



let convertCard (cards: Cards.card list) (cardIndex: int) : text list = 
    match List.tryItem cardIndex cards with
            | Option.None -> []
            | Some value -> match value with
                            | Callout callout -> convertCallout callout
                            | Toggle toggle -> convertToggle toggle
                            | Code code -> convertCode code

let modifyOpenMarkups (openMarkups: int list) (newMarkups: int list) (numClosedMarkups: int) : int list = 
    let rec removeMarkups (markups: int list, numClosedMarkups: int) : int list = 
        match numClosedMarkups with
        | 0 -> markups
        | _ -> removeMarkups (List.tail markups, numClosedMarkups - 1)
    // My current assumption is that we append newMarkups to the list and remove starting from the last markup in the list
    removeMarkups (List.append openMarkups newMarkups, numClosedMarkups)

let retrieveMarkups (markups: Markups.markup list) (indices: int list) : Markups.markup list = 
    List.map (fun index -> List.item index markups) indices

let convertValue (sectionBlock : sectionBlock) (openMarkups : Markups.markup list) : textType = 
    let isLink markup = 
        match markup with
            | Markups.Link _ -> true 
            | _ -> false
    
    let listContainsLink list = 
        List.exists (isType) list

    if listContainsLink openMarkups then
        Text sectionBlock.value // Should be URL type in future
    else
        Text sectionBlock.value

let convertSectionBlocks (markups: Markups.markup list) (sectionBlock: list<sectionBlock>) : text list = 
    let rec convertSectionBlock (sections: list<sectionBlock>) (openMarkups : int list) : text list = 
        match sections with 
            | [] -> []
            | x :: xs -> 
                let openMarkups = modifyOpenMarkups openMarkups x.openMarkups x.numClosedMarkups
                let retrievedMarkups = retrieveMarkups markups openMarkups

                {
                    data = convertValue x retrievedMarkups
                    style = convertMarkups retrievedMarkups

                } :: (convertSectionBlock xs openMarkups)
    
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

