import styled from "styled-components";
import { device } from "../../styles/device";
import { sphereProps } from "./Sphere-Styled";

export const AboutUsPage = styled.div`
    position: relative;
    top: -50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50vmin;
`

export const AboutUsContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-bottom: 5vw;
    gap: 20px;
    z-index: 2;
`

export const AboutUsText = styled.div`
    color: var(--accent-darker-purple);
    font-family: 'Raleway';
    font-weight: 800;
    font-size: 5vmin;
    line-height: 2vmin;
    text-align: right;
`

export const MainText = styled.div`
    max-width: 58vw;
    background: #A09FE3;
    border-radius: 1vw;
    color: #FFFFFF;
    font-weight: 400;
    padding: 20px;
    font-size: 3vmin;
    text-align: center;
    padding: 1.4vw 2vw;
    margin-top: 2.8vmin;
`;

export const BlueText = styled.span`
    color: #3977F8;
`

export const MoreInfoText = styled.div<sphereProps>`
    transform: rotate(${props => props.rotation ? -props.rotation : 0}deg);
    color: #FFFFFF;
    font-weight: 700;
    line-height: 58px;
    font-size: 3vmin;
    
    &:hover { 
      cursor: pointer;
      transform: rotate(${props => props.rotation ? -props.rotation : 0}deg) scale(1.1);
    }
`;