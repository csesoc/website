module Main

open GhostSyntax
open CMSSyntax
open Newtonsoft.Json

open FSharpPlus
open Fleece.Newtonsoft
open Fleece.Newtonsoft.Operators
open System.IO
open Converters

[<EntryPoint>]
let main args =
    let ghostDocument: GhostDocument ParseResult = ofJsonText (File.ReadAllText args[0])

    let result = 
        match Option.ofResult ghostDocument with
        | Some document -> toJsonText (GhostToCms document) 
        | _ -> "failed to parse ghost document"

    printfn "%s" result
    
    0