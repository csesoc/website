import styled from "styled-components";
import { device } from "../../styles/device"

const Container = styled.div`
	position: sticky;
	top: 0;
	width: 100%;
	height: 10vh;
	background: transparent;
	display: flex;
	z-index: 9000;
`;

const MiniPageContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 10vh;
  background: transparent;
  display: flex;
  z-index: 9000;
  background-color: #A09FE3;
  justify-content: flex-end;

  @media ${device.tablet} {
    justify-content: space-between;
  }
`

const BlogPageContainer = styled.div`
	position: sticky;
	top: 0;
	width: 100%;
  	padding: 3rem 7rem;
	background-color: #E8DBFF;
`

const LogoWrapper = styled.div`
  display: flex;
  justify-content: flex-start;  
  cursor: pointer;
`

const BlogLinkWrapper = styled.ul`
  width: 100%;
  display: inline-flex;
	align-items: center;
  justify-content: flex-end;
	gap: 5vw;
	list-style: none;
	padding: 0 20px;
	@media (max-width: 768px) {
		padding: 0;
		gap: 0;
	}
`

const ItemWrapper = styled.ul`
	display: inline-flex;
	align-items: center;
	margin-left: auto;
	gap: 5vw;
	list-style: none;
	padding: 0 20px;
	@media (max-width: 768px) {
		padding: 0;
		gap: 0;
	}
`;

const NavItem = styled.li`
	font-size: 20px;
	font-weight: bold;

	@media (max-width: 768px) {
		display: none;
	}

	&:hover { 
		cursor: pointer;
		transform: scale(1.1);
	}
`;

const HomepageButton = styled.div`
  font-size: 2vw;
  font-weight: bold;
  margin-right: 1.2vw;
  display: none;
  align-self: center;


  @media ${device.tablet} {
    font-size: 20px;
    display: inline-flex;
  }

  &:hover { 
		cursor: pointer;
		transform: scale(1.1);
	}
`

const HamburgerButton = styled.button`
	width: fit-content;
	height: auto;
	cursor: pointer;
	background-color: transparent;
	border: none;
	display: none;
	@media (max-width: 768px) {
		display: block;
	}
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 25vw;
  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`


export { Container, ItemWrapper, NavItem, HamburgerButton, ImageWrapper, MiniPageContainer, LogoWrapper, BlogPageContainer, BlogLinkWrapper, HomepageButton };
