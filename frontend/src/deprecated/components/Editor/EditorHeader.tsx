import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from 'react-router-dom';


const Container = styled.div`
  height: 50px;
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
/* Preview and text to be changed into a dropdown menu */

const EditorHeader: React.FC = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <Container>
      <HeaderFlex>
        <IconButton aria-label="back" onClick={() => handleClick()}>
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>

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