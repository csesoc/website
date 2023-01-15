import styled from "styled-components";
import Countdown from "./Countdown";

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: pink;
`;

export default function WelcomeView() {
    return (
        <MainContainer>
            <Countdown />
        </MainContainer>
    );
}