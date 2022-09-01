import styled from "styled-components";

const MenuOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 999;
  background-color: rgba(0,0,0, 0.65);
  width: 100%;
  height: 100%;
  transition: 0.5s;
  transition-timing-function: ease-out;
  @media (max-width: 768px) {
    display: block;
  }
`;
const MenuContainer = styled.div`
  position: absolute;
  right: 0px;
  background-color: white;
  height: 100vh;
  display: none;
  z-index: 1000;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 30vw;
  }
  @media (max-width: 428px) {
    width: 100vw;
  }
`;
const MenuItemWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  row-gap: 5vh;
  padding: 0 2vw;
`;
const MenuItem = styled.li`
  display: inline-block;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 16px;
  };
  @media (max-width: 428px) {
    font-size: 12px;
  }
  &:hover {
    cursor: pointer;
    font-weight: bold;
  }
`;
const MenuHeader = styled.div`
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 20px 2vw;
  }
  @media (max-width: 428px) {
    padding: 30px 5vw;
  }
`;
const CloseButton = styled.button`
    width: fit-content;
    height: auto;
    background-color: transparent;
    cursor: pointer;
    border: none;
    display: none;
    @media (max-width: 768px) {
      display: inline-block;
      margin-left: auto;
    }
`;
const LogoContainer = styled.div`
  display: none;
  @media (max-width: 428px) {
    max-width: 100px;
    height: auto;
    display: inline-block;
    padding: 1vh 0 0 5vw;
  }
`;

export {
  MenuOverlay, MenuContainer, MenuHeader,
  MenuItemWrapper, MenuItem, LogoContainer, CloseButton
};