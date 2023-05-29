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
    font-size: min(5vmin, 40px);
    line-height: min(2vmin, 20px);
    text-align: right;
`

export const MainText = styled.div`
    max-width: 58vw;
    background: #A09FE3;
    border-radius: 1vw;
    color: #FFFFFF;
    font-weight: 500;
    font-size: min(3vmin, 32px);
    line-height: min(3.5vmin, 45px);
    text-align: center;
    padding: min(2.5vmin, 25px) min(2vmin, 20px);
    margin-top: min(2.8vmin, 25px);
`;

export const BlueText = styled.span`
    color: #3977F8;
`

export const MoreInfoText = styled.div<sphereProps>`
    transform: rotate(${props => props.rotation ? -props.rotation : 0}deg);
    color: #FFFFFF;
    font-weight: 700;
    font-size: min(3vmin, 32px);
    line-height: min(3.5vmin, 40px);
    text-align: center;
    
    &:hover { 
      cursor: pointer;
      transform: rotate(${props => props.rotation ? -props.rotation : 0}deg) scale(1.1);
    }
`;