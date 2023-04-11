import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react'


const Container = styled.div`
  height: 65px;
  background: #A09FE3;
  width: 100%;
`
const EditorTitle = styled.div`
  font-size: large;
  color: white;
`

const HeaderFlex = styled.div`
display: flex;
flex-direction: row;
flex-wrap: nowrap;
justify-content: space-between;
align-items: center;
padding: 0.3rem 0.5rem;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: 20px;
`
const ButtonStyle = styled(Button)`
&& {
  width: 10px;
  background-color: white;
  border-radius: 100px;
  text-transform: none;
  padding: 7px 19px;
  min-width: 2px;
}
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
`

/* Preview and text to be changed into a dropdown menu */

// type Props = {
//   filename?: string;
//   children: ReactNode;
// }

const EditorHeader: React.FC = (props) => {

  // const navigate = useNavigate();

  return (
    <Container>
      <HeaderFlex>

        {/* <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <ArrowBackIcon fontSize="inherit" />
        </IconButton> */}
  
        {/* <ButtonContainer> */}
        {props.children}
        {/* </ButtonContainer> */}
        {/* <ButtonGroup>
          <ButtonStyle>
          ←
          </ButtonStyle>
          <EditorTitle>
            /blogs/blog1
          </EditorTitle>
        </ButtonGroup>
        <EditorTitle>
          Session identifier
        </EditorTitle>
        <EditorTitle>
          Preview and text
        </EditorTitle> */}
      </HeaderFlex>
    </Container>
  );
};

export default EditorHeader;