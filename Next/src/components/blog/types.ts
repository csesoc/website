export interface Document {
  document_name: string;
  document_id: string;
  content: Element[];
}

export type Element = Paragraph | Image;

interface Paragraph {
  type: "paragraph";
  align?: "left" | "right" | "center";
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
}
