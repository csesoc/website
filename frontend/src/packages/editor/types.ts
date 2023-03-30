import { ReactEditor } from "slate-react";
import { BaseEditor, BaseOperation, Descendant } from "slate";

export type BlockData = Descendant[];

export type OpPropagator = (id: number, update: BlockData, operation: BaseOperation[]) => void;
export type UpdateCallback = (id: number, update: BlockData) => void;

type CustomElement = { type: "paragraph" | "heading"; children: CustomText[] };
export type CustomText = {
  textSize?: number;
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  type?: string;
  align?: string;
  code?: string;
};

export interface CMSBlockProps {
  update: OpPropagator;
  initialValue: BlockData;
  id: number;
  showToolBar: boolean;
  onEditorClick: () => void;
}


declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
