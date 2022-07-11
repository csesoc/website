import { ReactEditor } from "slate-react";
import { BaseEditor, Descendant } from "slate";

export type BlockData = Descendant[];
export type UpdateHandler = (idx: number, updatedBlock: BlockData) => void;

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
