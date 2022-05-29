import { getContents } from "./selectors";

export const defaultContent = JSON.stringify([
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
]);

export const getBlockContent = (id: number) => {
  const contents = getContents();

  contents.map((content) => {
    if (content.id == id) {
      return content.data
    }
  })
  return defaultContent
};