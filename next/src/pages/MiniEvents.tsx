import React from 'react';
import styled from "styled-components";
import ClearLayeredGlass from "../components/eventspage/ClearLayeredGlassContainer";
import { device } from '../styles/device';

const Container = styled.div`
    /* background-color: #A09FE3; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 100px;
    @media ${device.laptop} {
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        margin: 30vh 10vw;
    }
    z-index: 100;
`

const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 60vw;
    @media ${device.laptop} {
        padding: 30px;
    }
`

const HeadingText = styled.div`
    color: var(--accent-darker-purple);
    font-family: 'Raleway';
    font-weight: 800;
    font-size: 40px;
    @media ${device.laptop} {
        font-size: 3.5vw;
        line-height: 0vw;
        text-align: left;
        margin-top: 2vw;
    }
`

const BodyText = styled.div`
    color: var(--accent-darker-purple);
    font-weight: 200;
    font-size: 20px;
    @media ${device.tablet} {
        font-size: 1.9vw;
        line-height: 2.5vw;
        margin-top: 3vw;
    }

    @media ${device.laptop} {
        color: white;
    }

`;

export default function Events() {
    return (
        <Container>
            <ColumnContainer>
                <HeadingText>
                    Events
                </HeadingText>
                <BodyText>
                    We run a wide-variety of events for fun, learning new skills and careers. For full listings, check out the CSESoc Discord or our Facebook page!
                </BodyText>
            </ColumnContainer>
            <ClearLayeredGlass />
        </Container>
    )
}
