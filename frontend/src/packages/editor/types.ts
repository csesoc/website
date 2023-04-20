import { ReactEditor } from "slate-react";
import { BaseEditor, BaseOperation, Range, Descendant, BaseRange } from "slate";

export type BlockData = Descendant[];

export type OpPropagator = (id: number, update: BlockData, operation: BaseOperation[]) => void;
export type UpdateCallback = (id: number, update: BlockData) => void;

export type CustomText = {
  textSize?: number;
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  quote?: boolean;
  type?: string;
  align?: string;
  code?: string;
};

// export type ParagraphElement = {
//   type: "paragraph",
//   children: CustomText[]
// }

// export type HeadingElement = {
//   type: "heading",
//   children: CustomText[]
// }


// export type CodeBlockElement = {
//   type: 'code-block'
//   language?: string
//   children: CustomText[]
// }

// export type CodeLineElement = {
//   type: 'code-line'
//   children: Descendant[]
// }

export type CustomElement = { 
  type: "paragraph" | "heading" | "code-line" | "code-block"; 
  language?: string, 
  children: CustomText[] 
};

// type CustomElement = 
//     ParagraphElement 
//   | HeadingElement
//   | CodeBlockElement
//   | CodeLineElement

export interface CMSBlockProps {
  update: OpPropagator;
  initialValue: BlockData;
  id: number;
  showToolBar: boolean;
  onEditorClick: () => void;
}

export type CustomEditor = BaseEditor &
  ReactEditor & {
    nodeToDecorations?: Map<Element, Range[]>
  }

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
    Range: BaseRange & {
      [key: string] : unknown
    };
  }
}
