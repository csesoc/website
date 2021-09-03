import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const Container = styled.div`
  width: 250px;
  background: lightgrey;
  height: 100vh;
`
// Wrapper component
const SideBar: React.FC = () => {
  return (
    <Container>
      <div className="sidebar-header">
        Welcome "name"
      </div>
      <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      >
        <Box>
          <Button
          variant="contained"
          className="sidebar-button"
          >
            Blog
          </Button>
        </Box>
        <Box>
          <Button 
          variant="contained"
          className="sidebar-button"
          >
            Core pages
          </Button>
        </Box>
        <Box>
          <Button 
          variant="contained"
          className="sidebar-button"
          color="primary"
          >
            New page
          </Button>
        </Box>
        <Box>
          <Button 
          variant="contained"
          className="sidebar-button"
          color="primary"
          >
            New folder
          </Button>
        </Box>
        <Box>
          <Button 
          variant="contained"
          className="sidebar-button"
          color="secondary"
          >
            Edit
          </Button>
        </Box>
          <Box>
          <Button 
          variant="contained"
          className="sidebar-button"
          color="secondary"
          >
            Feature
          </Button>
        </Box>
        <Box>
          <Button 
          variant="contained"
          className="sidebar-button"
          color="secondary"
          >
            Recycle
          </Button>
      </Box>
      </Box>
    </Container>
  )
}

export default SideBar
