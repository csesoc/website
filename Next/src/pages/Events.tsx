import React from 'react';
import styled from "styled-components";
import ClearLayeredGlass from "../components/eventspage/ClearLayeredGlassContainer";

const Container = styled.div`
    min-height: 100vh;
    background-color: #A09FE3;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`

const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 28vw;
`

const EventsText = styled.div`
    color: #FAFCFF;
    font-family: 'Raleway';
    font-weight: 800;
    font-size: 3.5vw;
    line-height: 0vw;
    text-align: left;
    margin-top: 2vw;
`

const BodyText = styled.div`
    font-weight: 200;
    font-size: 1.9vw;
    line-height: 2.5vw;
    margin-top: 3vw;
`;

export default function Events() {
    return (
        <Container>
            <ColumnContainer>
                <EventsText>
                    Events
                    <BodyText>
                        We run a wide-variety of events for fun, learning new skills and careers. For full listings, check out the CSESoc Discord or our Facebook page!
                    </BodyText>
                </EventsText>
            </ColumnContainer>
            <ClearLayeredGlass />
        </Container>
    )
}
