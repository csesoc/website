import React from 'react';
import styled from "styled-components"

import ContentBlock from "./components/ContentBlock";
import EditorHeader from "src/deprecated/components/Editor/EditorHeader";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const Editor = () => {

  return (
    <div style={{ height: "100%" }}>
      <EditorHeader />
      <Container>
        <ContentBlock />
      </Container>
    </div>
  );
};


export default Editor;