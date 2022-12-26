import { Fragment, KeyboardEvent, useRef } from "react";
import {
  Button,
  Buttons,
  Circle,
  Line,
  ProgressLine,
  ProgressLineWrapper,
  Wrapper,
} from "./Timeline-styled";

type Props = {
  focusedView: number;
  setFocusedView: (_focusedView: number) => void;
  viewNames: string[];
};

const Timeline = ({ focusedView, setFocusedView, viewNames }: Props) => {
  const keyHandler = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        setFocusedView(focusedView - 1);
        break;
      case "ArrowRight":
        setFocusedView(focusedView + 1);
        break;
    }
  };

  return (
    <Wrapper>
      <ProgressLineWrapper>
        <ProgressLine
          progressPercent={((1 + 2 * focusedView) / (viewNames.length * 2 - 1)) * 100}
        />
      </ProgressLineWrapper>
      <Buttons onKeyDown={keyHandler} tabIndex={1}>
        {viewNames.map((name, idx) => (
          <Fragment key={idx}>
            <Circle filled={idx <= focusedView} onClick={() => setFocusedView(idx)} tabIndex={-1} />
            <Button
              filled={idx <= focusedView}
              active={idx === focusedView}
              onClick={() => setFocusedView(idx)}
              tabIndex={-1}
            >
              {name}
            </Button>
          </Fragment>
        ))}
      </Buttons>
      <Line />
    </Wrapper>
  );
};

export default Timeline;
