import { Button, Buttons, Circle, Line, Wrapper } from "./Timeline-styled";

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
              <Circle filled={idx <= focusedView} />
              <Button filled={idx <= focusedView}>{viewNames[idx]}</Button>
            </>
          );
        })}
      </Buttons>
      <Line />
      {/* <TimelineButton text={viewNames[focusedView]} /> */}
    </Wrapper>
  );
}
