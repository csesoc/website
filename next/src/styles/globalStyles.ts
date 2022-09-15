import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
  font-family: 'Raleway', sans-serif;
}

:root {
  /* global css color variables */
  --primary-purple: #9291DE;
  --primary-blue: #3977F8;
  --accent-darker-purple: #5E5D8D;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
`;
