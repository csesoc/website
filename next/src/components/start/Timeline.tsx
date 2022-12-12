import styled from "styled-components";

const lightPurple = "#BEB8E7";

const Button = styled.button`
  background: ${lightPurple};
  border: none;
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`;

function TimelineButton({ text, filled }: { text: string; filled: boolean }) {
  return <Button>{text}</Button>;
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 30px;
`;

const Buttons = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
`;

const Circle = styled.div`
  border-radius: 100%;
  border: 5px solid ${lightPurple};
  width: 25px;
  height: 25px;
  background: #fcf7de;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`;

const Line = styled.div`
  flex: 1;
  height: 6px;
  background-image: linear-gradient(to right, #c0cff8, #b1a6ff);
  margin: 0 12.5px;
`;

function TimelineCircle({ filled }: { filled: boolean }) {
  return <Circle />;
}

export default function Timeline({
  focusedView,
  viewNames,
}: {
  focusedView: number;
  viewNames: string[];
}) {
  return (
    <Wrapper>
      <Buttons>
        {viewNames.map((name, idx) => {
          return (
            <>
              <TimelineCircle filled={idx <= focusedView} />
              <TimelineButton text={viewNames[idx]} filled={idx <= focusedView} />
            </>
          );
        })}
      </Buttons>
      <Line />
      {/* <TimelineButton text={viewNames[focusedView]} /> */}
    </Wrapper>
  );
}
