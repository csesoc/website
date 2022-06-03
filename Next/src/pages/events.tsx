import styled from "styled-components";
import EventsContainer from "./assets/EventsContainer";

const EventsPage = styled.div`
    position: relative;
    height: 100vh;
    background-color: #A09FE3;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

const EventsContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 35vw;
`

const MainTitle = styled.div`
    color: #FAFCFF;
    font-family: 'Raleway';
    font-weight: 800;
    font-size: 4.3vw;
    line-height: 0vw;
    text-align: left;
    text-shadow: 0px 0px;
    margin-top: 2vw;
`

const MainText = styled.div`
    border-radius: 1vw;
    color: #FAFCFF;
    font-family: 'Raleway';
    font-weight: 190;
    font-size: 2vw;
    line-height: 3vw;
    text-align: left;
    text-shadow: 0px 0px;
    margin-top: 3vw;
`;

const Events = () => (
    <div>
        <EventsPage>
            <EventsContent>
                <MainTitle>
                    Events
                </MainTitle>
                <MainText>
                    We run a wide-variety of events for fun, learning new skills and careers. For full listings, check out the CSESoc Discord or our Facebook page!
                </MainText>
            </EventsContent>
            <EventsContainer />
        </EventsPage>
    </div>
)

export default Events