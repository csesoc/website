import React from 'react';
import styled from 'styled-components';
import EditorHeader from 'src/components/Editor/EditorHeader';
import EditorFile from 'src/components/Editor/EditorFile';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Editor: React.FC = () => {
    return (
        <div className="Editor">
            <EditorHeader/>
            <Container>
                <EditorFile/>
            </Container>
        </div>
    );    
};

export default Editor;