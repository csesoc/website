import React from "react";
import { generateStories } from 'src/cse-ui-kit/helpers/Storybook';
import Button from './Button';

const stories = generateStories("Buttons");

stories.add("Buttons", () => {
  return (
    <div>
      <h1>this is a button</h1>
      <Button/>
    </div>
  )
})