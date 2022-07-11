import { storiesOf } from "@storybook/react";

const STORYBOOK_TITLE = 'cse-ui-kit'
export const generateStories = (name: string) =>
  storiesOf(`${STORYBOOK_TITLE} / ${name}`, module);