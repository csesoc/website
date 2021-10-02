import React from 'react';
import styled from 'styled-components';


const Container = styled.div`
  background: #eeeeee;
  width: 15%;
  overflow-y: scroll;
`

// Placeholder
const EditorSidebar: React.FC = () => {
  return (
    <Container>
      This is the sidebar
    </Container>
  );    
};

export default EditorSidebar;