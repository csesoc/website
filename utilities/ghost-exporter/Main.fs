module Main

open GhostSyntax
open CMSSyntax
open Newtonsoft.Json

open FSharpPlus
open Fleece.Newtonsoft
open System.IO
open Converters

[<EntryPoint>]
let main args =
    let ghostDocument = ofJsonText (File.ReadAllText args[0])

    match Option.ofResult ghostDocument with
        | Some document -> 
            // Write the result to disk
            let compiledResult = toJsonText (GhostToCms document)
            let fileName = Path.GetFileNameWithoutExtension (args[0])
            File.WriteAllText ($"{Path.GetFileNameWithoutExtension (args[0])}__exported.json", compiledResult)

        | _ -> printfn "%s" "failed to parse ghost document"
    
    0