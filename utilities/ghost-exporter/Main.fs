module Main

open GhostSyntax
open Newtonsoft.Json

[<EntryPoint>]
let main args =
    printfn "%A" (JsonConvert.DeserializeObject("""
    [
        "a",
        [
          "href",
          "https://en.wikipedia.org/wiki/Composite_pattern"
        ]
    ]
    """))

    0
