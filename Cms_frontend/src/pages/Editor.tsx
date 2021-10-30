import React from 'react';
import styled from 'styled-components';
import EditorHeader from 'src/components/Editor/EditorHeader';
import EditorFile from 'src/components/Editor/EditorFile';
import EditorSidebar from 'src/components/Editor/EditorSidebar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Editor: React.FC = () => {
  return (
    <div style={{ height: '100%' }}>
      <EditorHeader />
      <div className="Editor" style={{ display: 'flex' }}>
        <EditorSidebar />
        <div style={{ flex: 1 }}>
          <Container>
            <EditorFile />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Editor;