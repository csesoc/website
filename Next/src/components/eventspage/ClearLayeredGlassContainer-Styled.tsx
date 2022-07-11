import styled from "styled-components";

export type positionProps = {
    position: string;
    top?: number;
    left?: number;
};

export const StyledContainer = styled.div<positionProps>`
    position: ${(props) => props.position};
    width: 36.7vw;
    height: 20vw;
    top: ${(props) => props.top}vw;
    left: ${(props) => props.left}vw;
    border-radius: 1vw;
    background-color: #FFFFFF30;
    border-width: 0.15vw;
    border-style: solid;
    border-color: #FAFCFF;
`;

export const ImgContainer = styled.div`
    position: relative;
    width: 36vw;
    height: 17.8vw;
    top: 2.15vw;
    left: 1.5vw;
`