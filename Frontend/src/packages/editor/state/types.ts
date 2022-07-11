import { Descendant } from "slate";

export type BlockInfo = {
  id: number
  data: Descendant[]
}

export type editorState = {
  contents: (BlockInfo)[]
}