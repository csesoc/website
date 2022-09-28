import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Link from 'next/link'
import Otter from '../../svgs/otter.png'
import Image from 'next/image';

import styled from "styled-components";

export const StyledSphere = styled.div`
	width: 18vw;
	height: 18vw;
	background: #E8DBFF;
	mix-blend-mode: normal;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
`;

export const Content = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	height: 90vh;
`
export const StyledBlogLinks = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 90vh;
	font-family: 'Raleway';
  font-weight: 400;
  font-size: 17px;
  line-height: 27pt;
  word-wrap: break-word;
	color: #000000;
`

export const LinkTextStyle = styled.a`
	&:hover {
    color: #44a6c6;
  }
  &:active {
    color: #31738a;
  }
  cursor: pointer;
`

const Index: NextPage = () => {
	return (
		<div>
			<Content>
				<StyledSphere>
					<Image src={Otter} />
				</StyledSphere>
				<StyledBlogLinks>
					<LinkTextStyle></LinkTextStyle>
					<Link href="/blog">
						<LinkTextStyle>Blog 1</LinkTextStyle>
					</Link>
					<Link href="/blog">
						<LinkTextStyle>Blog 2</LinkTextStyle>
					</Link>
					<Link href="/blog">
						<LinkTextStyle>Blog 3</LinkTextStyle>
					</Link>
					<Link href="/blog">
						<LinkTextStyle>Blog 4</LinkTextStyle>
					</Link>
				</StyledBlogLinks>
			</Content>
		</div>

	);
};
export default Index;