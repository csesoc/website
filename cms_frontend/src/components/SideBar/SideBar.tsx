import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 250px;
  background: grey;
  height: 100vh;
`


// Wrapper component
const SideBar: React.FC = () => {
  return (
    <Container>
      Sidebar
    </Container>
  )
}

export default SideBar
