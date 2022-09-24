module Converters
module List

open CMSSyntax
open GhostSyntax

let GhostToCms (document: GhostDocument) : CMSDocument = 
    {
        documentName = "replace me"
        documentId = 0
        content = List.Map (convertSection document.Cards document.Markups) document.content
    }

let convertSection (cards: Cards.card list) (markups: Markups.markup list) (section: Sections.section) : paragraph = 
    let texts = match section.blockValue with
                | Section sectionBlock -> convertSectionTexts markups sectionBlock
                | CardReference index -> convertCard cards index
                | _ -> []
    {
        paragraphAllign = Center
        children = texts
    }

let convertSectionTexts (markups: Markups.markup list) (sectionBlock: sectionBlock) : text list = 
    // Some loop that iterates over sectionBlock and keeps track of each markup this feels ugly to me
    // There has to be some sort of functional way to do this? probs with map fold or monads idfk
    texts = []
    openMarkups = []
    for section in sectionBlock do
        let markup = modifyOpenMarkups openMarkups section.openMarkups section.numClosedMarkups
        let text = {
            data = sectionBlock.value
            style = List.Map (fun x -> List.tryItem x markups) markups |> convertMarkups
        }
        texts = texts :: text
    // Hopefully this is the way to return a value?
    texts

let modifyOpenMarkups (openMarkups: int list) (newMarkups: int list) (numClosedMarkups: int) : int list = 
    // How does adding and removing markups actually work in ghost?
    let rec removeMarkups (markups: int list, numClosedMarkups: int) : int list = 
        match numClosedMarkups with
        | 0 -> markups
        | _ -> removeMarkups (List.tail markups, numClosedMarkups - 1)
    // My current assumption is that we append newMarkups to the list and close the last markup in the list
    let newMarkups = removeMarkups (openMarkups :: newMarkups, numClosedMarkups)
    newMarkups

let convertMarkup (markUps: Markups.markup list) : style = 
    link = False
    code = False
    emphasis = False
    strong = False

    for markup in markUps do
        match markup with
        | Markups.Link _ -> link = True
        | Markups.Code _ -> code = True
        | Markups.Emphasis _ -> emphasis = True
        | Markups.Strong _ -> strong = True
    {
        link = link
        code = code
        emphasis = emphasis
        strong = strong
    }


let convertCard (cards: Cards.card list, cardIndex: int) : text list = 
    cardToConvert = List.tryItem cardIndex cards
    let texts = match cardToConvert with
                | callout Callout -> convertCallout Callout
                | toggle Toggle -> convertToggle Toggle
                | code Code -> convertCode Code
                | _ -> None
    
    texts


let convertCallout (callout: callout) : text list = 
    // How do we actually convert callouts to text?
    // I'm assuming we just return the text of the callout and ignore colour and emojir for now
    Text callout.calloutText

