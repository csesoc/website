import styled from "styled-components";
import { device } from "../../styles/device";

export type positionProps = {
    position?: string;
    top?: number;
    left?: number;
    dark?: boolean;
    center?: boolean;
};

export const GlassContainer = styled.div<positionProps>`
    position: ${(props) => props.position};
    
    display: ${(props) => props.center ? "flex" : ""};
    justify-content: ${(props) => props.center ? "center" : ""};
    align-items: ${(props) => props.center ? "center" : ""};

    top: ${(props) => props.top}vw;
    left: ${(props) => props.left}vw;
    border-radius: 1vw;
    background-color: ${(props) => props.dark ? '#00000030' : '#FFFFFF30'};
    border-width: 0.15vw;
    border-style: solid;
    border-color: #FAFCFF;
    width: min(70vmin, 700px);
    height: min(40vmin, 400px);
`;

export const ImgContainer = styled.div`
    position: relative;
    width: 77vmin;
    height: 60vmin;
    top: -4.15vmin;
    left: 1.5vmin;
`