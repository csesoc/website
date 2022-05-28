import { ReactNode } from "react";

export type RenderLeafProps = {
  attributes: any
  children: ReactNode
  leaf: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
}
export type ContentBlockProps = {
  id: number;
  showToolBar: boolean;
  onEditorClick: () => void;
}