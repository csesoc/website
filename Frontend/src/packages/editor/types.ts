import { ReactEditor } from "slate-react";
import { BaseEditor, Descendant } from "slate";

export type BlockData = Descendant[];
export type UpdateHandler = (idx: number, updatedBlock: BlockData) => void;

type CustomElement = { type: "paragraph" | "heading"; children: CustomText[] };
type CustomText = {
  textSize?: number;
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  type?: string;
<<<<<<< HEAD
  align?: string;
=======
>>>>>>> b64c8fc33642d727366f7d42bfce1de2c472fa3d
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
