import styled from "styled-components";
import { device } from "../../styles/device";
import { sphereProps } from "./Sphere-Styled";

export const AboutUsPage = styled.div`
    position: relative;
    top: -50px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 22vh;
`

export const AboutUsContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-bottom: 5vw;
    gap: 20px;
    z-index: 2;
`

type positionProps = {
    left?: number;
    top?: number;
}

export const SpherePosition = styled.div<positionProps>`
    position: absolute;
    z-index: 0;
    left: ${props => props.left}%;
    top: ${props => props.top}%;
`

export const AboutUsText = styled.div`
    color: var(--accent-darker-purple);
    font-family: 'Raleway';
    font-weight: 810;

    font-size: 40px;
    @media ${device.tablet} {
        font-size: 3.5vw;
        line-height: 1.9vw;
        text-align: right;
    }

`

export const MainText = styled.div`
    max-width: 58vw;
    background: #A09FE3;
    border-radius: 1vw;
    color: #FFFFFF;
    font-weight: 400;
    font-size: 18px;
    padding: 20px;
    line-height: 20px;
    @media ${device.tablet} {
        font-size: 2vw;
        text-align: center;
        padding: 1.4vw 2vw;
        margin-top: 2.8vw;
        line-height: 2.5vw;
    }
`;

export const BlueText = styled.span`
    color: #3977F8;
`

export const MoreInfoText = styled.div<sphereProps>`
    transform: rotate(${props => props.rotation ? -props.rotation : 0}deg);
    color: #FFFFFF;
    font-weight: 700;
    line-height: 58px;
    font-size: 2vw;

    &:hover { 
      cursor: pointer;
      transform: rotate(${props => props.rotation ? -props.rotation : 0}deg) scale(1.1);
    }
`;