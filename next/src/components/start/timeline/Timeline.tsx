import { Fragment } from "react";
import { Button, Buttons, Circle, Line, Wrapper } from "./Timeline-styled";

type Props = {
  focusedView: number;
  setFocusedView: (_focusedView: number) => void;
  viewNames: string[];
};

export default function Timeline({ focusedView, setFocusedView, viewNames }: Props) {
  return (
    <Wrapper>
      <Buttons>
        {viewNames.map((name, idx) => {
          return (
            <Fragment key={idx}>
              <Circle filled={idx <= focusedView} onClick={() => setFocusedView(idx)} />
              <Button filled={idx <= focusedView} onClick={() => setFocusedView(idx)}>
                {viewNames[idx]}
              </Button>
            </Fragment>
          );
        })}
      </Buttons>
      <Line />
      {/* <TimelineButton text={viewNames[focusedView]} /> */}
    </Wrapper>
  );
}
