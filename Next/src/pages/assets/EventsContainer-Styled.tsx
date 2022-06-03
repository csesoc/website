import styled from "styled-components";

export type positionProps = {
    position: string;
    top?: number;
    left?: number;
};

export const StyledContainer = styled.div<positionProps>`
    position: ${(props) => props.position};
    width: 40vw;
    height: 22vw;
    top: ${(props) => props.top}vw;
    left: ${(props) => props.left}vw;
    border-radius: 1vw;
    background-color: #FFFFFF20;
    border-width: 0.15vw;
    border-style: solid;
    border-color: #FAFCFF;
`;

export const ImgContainer = styled.div`
    position: absolute;
    width: 100%;
    top: 2vw;
    left: 2vw;
`