export interface Blog {
    blog_name: string;
    blog_id: string;
    content: BlogElement[];
  }
  
  export type BlogElement = Paragraph | Image | Headline | Title;
  
  interface Paragraph {
    type: "paragraph";
    align?: "left" | "right" | "center";
    children: Text[];
  }

  interface Headline {
    type: "headline";
    align?: "left" | "right" | "center";
    children: Text[];
  }

  interface Title {
    type: "title";
    align?: "left" | "right" | "center";
    children: Text[];
  }
  export interface Image {
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