export interface Document {
  document_name: string;
  document_id: string;
  content: Block[];
}

export type Block = Element[];

export type Element = Paragraph | Image | Code;

interface Paragraph {
  type: "paragraph";
  children: Text[];
}

interface Image {
  type: "image";
  url: string;
}

interface Code {
  type: "code";
  language: String;
  children: Text[]
}

interface Text extends TextStyle {
  text: string;
  link?: string;
}

interface CodeLine extends TextStyle {
  text: string;
  language: string;
}

export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "right" | "center";
  textSize: number;
}
