import { Fragment } from "react";
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
  return (
    <Wrapper>
      <ProgressLineWrapper>
        <ProgressLine
          progressPercent={((1 + 2 * focusedView) / (viewNames.length * 2 - 1)) * 100}
        />
      </ProgressLineWrapper>
      <Buttons>
        {viewNames.map((name, idx) => {
          return (
            <Fragment key={idx}>
              <Circle filled={idx <= focusedView} onClick={() => setFocusedView(idx)} />
              <Button
                filled={idx <= focusedView}
                active={idx === focusedView}
                onClick={() => setFocusedView(idx)}
              >
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
