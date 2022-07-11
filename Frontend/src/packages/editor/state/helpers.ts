import { getContents } from "./selectors";
import { Descendant } from "slate";

export const defaultContent: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
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