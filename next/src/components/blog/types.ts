export interface Document {
  document_name: string;
  document_id: string;
  content: Block[];
}

export type Block = Element[];

export type Element = Paragraph | Image;

interface Paragraph {
  type: "paragraph";
  children: Text[];
}

interface Image {
  type: "image";
  url: string;
}

interface Text extends TextStyle {
  text: string;
  link?: string;
}

export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  quote?: boolean;
  align?: "left" | "right" | "center";
  textSize: number;
}
