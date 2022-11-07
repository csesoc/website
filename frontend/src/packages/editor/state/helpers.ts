import { getContents } from "./selectors";
import { Descendant } from "slate";

export const defaultContent: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "", formattable: true, type: "customText" }],
  },
];

export const headingContent: Descendant[] = [
  {
    type: "heading",
    children: [{ text: "", formattable: true, type: "customText" }],
  },
];

export const getBlockContent = (id: number) => {
  const contents = getContents();

  contents.map((content) => {
    if (content.id == id) {
      return content.data
    }
  })
  return defaultContent
};