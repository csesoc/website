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

export type CustomElement = { 
  type: "paragraph" | "heading" | "code" | "media"; 
  language?: string, 
  mediaSrc?: string,
  children: Descendant[] 
};

export interface CMSBlockProps {
  update: OpPropagator;
  initialValue: BlockData;
  id: number;
  showToolBar: boolean;
  language?: string;
  onEditorClick: () => void;
}

export type CustomEditor = BaseEditor &
  ReactEditor & {
    nodeToDecorations?: Map<CustomElement, Range[]>
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
