import { ReactEditor } from "slate-react";
import { BaseEditor, Descendant } from "slate";

export type BlockData = Descendant[];
export type UpdateHandler = (idx: number, updatedBlock: BlockData) => void;

type CustomElement = { type: "paragraph" | "heading"; children: CustomText[] };
type CustomMediaElement = { type: "media"; src: string; children: [{text:""}]};
type CustomText = {
  textSize?: number;
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  type?: string;
  align?: string;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement | CustomMediaElement;
    Text: CustomText;
  }
}
