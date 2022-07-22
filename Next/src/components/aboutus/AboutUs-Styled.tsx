import styled from "styled-components";

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
    line-height: 1.9vw;
    text-align: right;
`

export const MainText = styled.div`
    max-width: 58vw;
    background: #A09FE3;
    border-radius: 1vw;
    color: #FFFFFF;
    font-weight: 300;
    font-size: 1.3vw;
    text-align: center;
    padding: 1.4vw 2vw;
    margin-top: 2.8vw;
`;

export const BlueText = styled.span`
    color: #3977F8;
`