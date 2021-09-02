import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 250px;
  background: red;
  height: 250px;

`

interface DialogueProps {
  directory: string;
  isCore: boolean; // needed to make sure
}

// Wrapper component
const NewDialogue: React.FC = () => {
  return (
    <Container>
      dialogue box!
    </Container>
  )
}

export default NewDialogue
