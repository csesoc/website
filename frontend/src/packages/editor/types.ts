import { ReactEditor } from "slate-react";
import { BaseEditor, BaseOperation, Descendant } from "slate";

export type BlockData = Descendant[];

export type OpPropagator = (id: number, update: BlockData, operation: BaseOperation[]) => void;
export type UpdateCallback = (id: number, update: BlockData) => void;

export type CustomElement = { type: "paragraph" | "heading"; children: CustomText[] };
export type CustomText = {
  textSize?: number;
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  type?: string;
  align?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const IsCustomTextBlock = (o: any): o is CustomText => 'text' in o;
export const IsCustomElement = (o: any): o is CustomElement => 'type' in o && ["paragraph", "heading"].includes(o.type);

export type CMSEditorNode = CustomElement | CustomText;


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
