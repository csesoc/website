import styled from "styled-components";
import { device } from "../../styles/device";

export type positionProps = {
    position: string;
    top?: number;
    left?: number;
    dark?: boolean;
};

export const GlassContainer = styled.div<positionProps>`
    position: ${(props) => props.position};

    top: ${(props) => props.top}vw;
    left: ${(props) => props.left}vw;
    border-radius: 1vw;
    background-color: ${(props) => props.dark ? '#00000030' : '#FFFFFF30'};
    border-width: 0.15vw;
    border-style: solid;
    border-color: #FAFCFF;
    width: 80vw;
    height: 50vw;
    @media ${device.tablet} {
        width: 36.7vw;
        height: 20vw;
    }
`;

export const ImgContainer = styled.div`
    position: relative;
    width: 77vw;
    height: 60vw;
    top: -4.15vw;
    left: 1.5vw;
    @media ${device.tablet} {
        width: 36vw;
        height: 17.8vw;
        top: 2.15vw;
        left: 1.5vw;
    }
`