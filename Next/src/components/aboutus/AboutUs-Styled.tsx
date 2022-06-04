import styled from "styled-components";

export const AboutUsPage = styled.div`
    position: relative;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const AboutUsContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`

type positionProps = {
    left?: number;
    top?: number;
}

export const SpherePosition = styled.div<positionProps>`
    position: absolute;
    z-index: -1;
    left: ${props => props.left}%;
    top: ${props => props.top}%;
`

export const AboutUsText = styled.div`
    color: #A09FE3;
    font-family: 'Raleway';
    font-weight: 810;
    font-size: 3.5vw;
    line-height: 4vh;
    text-align: right;
    margin-top: 40vh;
`

export const MainText = styled.div`
    max-width: 58vw;
    background: #A09FE3;
    border-radius: 1vw;
    color: #FFFFFF;
    font-weight: 300;
    font-size: 1.3vw;
    text-align: center;
    padding: 3vh 2vw;
    margin-top: 6vh;
`;

export const BlueText = styled.span`
    color: #3977F8;
`