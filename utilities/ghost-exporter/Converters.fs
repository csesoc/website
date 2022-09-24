module Converters

open CMSSyntax
open GhostSyntax
open GhostSyntax.Sections
open GhostSyntax.Cards


let convertMarkup (markUps: Markups.markup list) : textStyle = 
    {
        bold = List.exists (fun markup -> match markup with | Markups.Link _ -> true | _ -> false) markUps
        italic = List.exists (fun markup -> match markup with | Markups.Code _ -> true | _ -> false) markUps
        underline = List.exists (fun markup -> match markup with | Markups.Emphasis _ -> true | _ -> false) markUps
    }


let convertCard (cards: Cards.card list) (cardIndex: int) : text list = 
    match List.tryItem cardIndex cards with
            | Option.None -> []
            | Some value -> match value with
                            | Callout callout -> convertCallout Callout
                            | Toggle toggle -> convertToggle Toggle
                            | Code code -> convertCode Code

let modifyOpenMarkups (openMarkups: int list) (newMarkups: int list) (numClosedMarkups: int) : int list = 
    // How does adding and removing markups actually work in ghost?
    let rec removeMarkups (markups: int list, numClosedMarkups: int) : int list = 
        match numClosedMarkups with
        | 0 -> markups
        | _ -> removeMarkups (List.tail markups, numClosedMarkups - 1)
    // My current assumption is that we append newMarkups to the list and close the last markup in the list
    removeMarkups (List.append openMarkups newMarkups, numClosedMarkups)

let convertSectionTexts (markups: Markups.markup list) (sectionBlock: list<sectionBlock>) : text list = 
    let rec aux (sections: list<sectionBlock>) (openMarkups : int list): text list = 
        match sections with
            | [] -> []
            | x :: xs -> 
                let markup = modifyOpenMarkups openMarkups x.openMarkups x.numClosedMarkups
                {
                    data = Text x.value
                    style = List.map (fun x -> List.tryItem x markups) markup |> convertMarkups
                } :: (aux (xs) markup)

    aux sectionBlock []
let convertSection (cards: Cards.card list) (markups: Markups.markup list) (section: Sections.section) : paragraph = 
    {
        paragraphAllign = Center
        children = match section.blocks with
                    | Section sectionBlock -> convertSectionTexts markups sectionBlock
                    | CardReference index -> convertCard cards index
                    | _ -> []
    }


let GhostToCms (document: GhostDocument) : CMSDocument = 
    {
        documentName = "replace me"
        documentId = 0
        content = List.map (convertSection document.Cards document.Markups) document.Sections
    }

