import styled from "styled-components";

export type positionProps = {
    position: string;
    top?: number;
    left?: number;
    colour: string;
};

export const StyledContainer = styled.div<positionProps>`
    position: ${(props) => props.position};
    width: 47vw;
    height: 25vw;
    top: ${(props) => props.top}vw;
    left: ${(props) => props.left}vw;
    border-radius: 1vw;
    background-color: ${(props) => props.colour};
    border-width: 0.15vw;
    border-style: solid;
    border-color: #FAFCFF;
`;