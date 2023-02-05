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
    margin: 30vmin 0vmin;
    @media ${device.laptop} {
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        margin: 50vmin 15vmin 10vmin 15vmin;
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
    font-size: 40px;
    font-size: 5vmin;
    line-height: 2vmin;
    text-align: left;
`

const BodyText = styled.div`
    color: var(--accent-darker-purple);
    font-weight: 500;
    font-size: 3vmin;
    text-align: left;
    padding: 20px 0;
    margin-top: 2.8vmin;
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
