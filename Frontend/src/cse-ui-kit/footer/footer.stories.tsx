import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReactComponent as CSELogo } from 'src/cse-ui-kit/assets/CSESoc logo.svg';
import styled from "styled-components";
import Footer from './footer';

const StyledText = styled.body`
    color: #FFFFFF;
    font-size: 12px;
    display: block;
`;

const StyledImage = styled.div`
    bottom: 0;
    position: fixed;
`;

export default {
  title: 'CSE-UIKIT/Footer',
  component: Footer,

} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    <Footer {...args}>
            <StyledImage><CSELogo width={270} height={52.58}/></StyledImage>
            <StyledText>B03 CSE Building K17, UNSW</StyledText>
            <StyledText>csesoc@csesoc.org.au</StyledText>
            <StyledText>© 2021 — CSESoc UNSW</StyledText>
    </Footer>
  </div>
)
export const Primary = Template.bind({});