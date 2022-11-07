import { ReactEditor } from "slate-react";
import { BaseEditor, BaseOperation, Descendant } from "slate";

export type BlockData = Descendant[];

export type OpPropagator = (id: number, update: BlockData, operation: BaseOperation[]) => void;
export type UpdateCallback = (id: number, update: BlockData) => void;

type CustomElement = { type: "paragraph" | "heading"; children: CustomText[] };

export type CustomCodeElement = { type: "code"; children: CustomCodeText[] };

export type NonFormattableBlock = { formattable: false; }

export type FormattableBlock = {
  formattable: true;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textSize?: number;
  code?: boolean;
  align?: string;
}

export type CustomText = {
  type: "customText";
  text: string;
} & FormattableBlock;

export type CustomCodeText = {
  type: "customCode";
  text: string;
  comment?: boolean;
  operator?: boolean;
  url?: boolean;
  keyword?: boolean;
  variable?: boolean;
  regex?: boolean;
  number?: boolean;
  boolean?: boolean;
  tag?: boolean;
  constant?: boolean;
  symbol?: boolean;
  "attr-name"?: boolean;
  selector?: boolean;
  punctuation?: boolean;
  string?: boolean;
  char?: boolean;
  function?: boolean;
  "class-name"?: boolean;
} & NonFormattableBlock;

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
    Element: CustomElement | CustomCodeElement;
    Text: CustomText | CustomCodeText;
  }
}
