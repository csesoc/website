import styled from "styled-components";

const Container = styled.div`
	position: sticky;
	top: 0;
	width: 100%;
	height: 10vh;
	background: transparent;
	display: flex;
	z-index: 9000;
`;
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

export { Container, ItemWrapper, NavItem, HamburgerButton };
