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
    gap: 10vmin;
    margin: 40vmin 0vmin;
    max-width: 100%;
    @media ${device.laptop} {
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        margin: 50vmin 15vmin;
    }
    z-index: 100;
`

const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 40%;
    @media ${device.laptop} {
        padding: 30px;
    }
`

const HeadingText = styled.div`
    color: var(--accent-darker-purple);
    font-family: 'Raleway';
    font-weight: 800;
    font-size: min(5vmin, 40px);
    line-height: min(2vmin, 20px);
    text-align: left;
`

const BodyText = styled.div`
    color: var(--accent-darker-purple);
    font-weight: 600;
    font-size: min(3vmin, 32px);
    line-height: min(3.5vmin, 45px);
    text-align: left;
    padding: 20px 0;
    margin-top: min(2.8vmin, 25px);
    @media ${device.tablet} {
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
