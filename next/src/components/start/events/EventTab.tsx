import { MouseEventHandler } from "react";
import styled from "styled-components";
import { device } from "../../../styles/device";

const EventTabContainer = styled.button`
  display: flex;
  border-radius: 5px;
  border: 5px solid #A683F8;
  width: 90%;
  max-width: 500px;
//   height: 70px;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: #A683F8;
  padding: 10px;
  font-size: 1em;
  background: white;
`;


type Props = {
    title: string;
    date: string;
    onClick: MouseEventHandler;
};

  
export default function EventTab({ title, date, onClick }: Props) {
return (
    <EventTabContainer onClick={onClick}>
        {date} | {title}
    </EventTabContainer>
)
}