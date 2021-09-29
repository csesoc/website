import React from 'react';
import styled from 'styled-components';

const EditorTitle = styled.div`
  font-size: xx-large;
  color: black;
  text-align: center;
`
const Heading_2 = styled.div`
  font-size: x-large;
  color: black;
  margin-bottom: 2rem;
`

const Container = styled.div`
  display: flex;
  grid-gap: 1rem;
  margin: 1rem;
  flex-direction: column;
  align-items: center;
`
const EditorDate = styled.div`
  font-size: medium;
  color: #47AEE8;
  text-align: center;
`
const EditorSubtitle = styled.div`
  font-size: large;
  color: black;
  background: #F5F5F5;
  width: 350%; 
  height: 150px;
  text-align: center;
  padding: 2rem;
  border-radius: 10px;
`
const EditorContent = styled.div`
  font-size: medium;
  color: black;
  width: 300%;
  background: white;
  margin-top: -100px;
  min-height: 700px;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 0 1px 1px lightgrey;
`

const EditorFile: React.FC = () => {
    return (
        <Container>
            <EditorDate>
            27 AUGUST 2021 / ARTICLES
            </EditorDate>
            <EditorTitle>
            "Heading 1"
            </EditorTitle>
            <EditorSubtitle>
            Insert link to media
            </EditorSubtitle>
            <EditorContent>
                <Heading_2>
                "Heading 2"
                </Heading_2>
                Content:
            </EditorContent>
        </Container>
  
    );    
  };
  
  export default EditorFile;