import { Fragment } from "react";
import { Button, Buttons, Circle, Line, Wrapper } from "./Timeline-styled";

type Props = {
  focusedView: number;
  setFocusedView: (_focusedView: number) => void;
  viewNames: string[];
};

const Timeline = ({ focusedView, setFocusedView, viewNames }: Props) => {
  return (
    <Wrapper>
      <Buttons>
        {viewNames.map((name, idx) => {
          return (
            <Fragment key={idx}>
              <Circle filled={idx <= focusedView} onClick={() => setFocusedView(idx)} />
              <Button filled={idx <= focusedView} onClick={() => setFocusedView(idx)}>
                {name}
              </Button>
            </Fragment>
          );
        })}
      </Buttons>
      <Line />
    </Wrapper>
  );
};

export default Timeline;
