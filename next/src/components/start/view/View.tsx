import { PropsWithChildren, useEffect, useRef } from "react";
import styled from "styled-components";
import { ViewProps } from "./types";

const StyledView = styled.article`
  display: flex;
  flex-basis: 100%;
  flex-shrink: 0;
  transition: transform 1s;
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const View = ({ idx, focusedView, children }: PropsWithChildren<ViewProps>) => {
  const previousFocusedView = useRef(focusedView);
  const firstUpdate = useRef(true);
  const viewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const view = focusedView;
    if (previousFocusedView.current === view) {
      viewRef.current?.animate(
        { transform: "translateY(1rem) scale(0.9)" },
        { duration: 1000, easing: "ease" },
      );
    } else {
      viewRef.current?.animate(
        [{}, { transform: "translateY(1rem) scale(0.9)" }, { transform: "none" }],
        {
          duration: 1000,
          easing: "ease",
        },
      );
    }

    previousFocusedView.current = focusedView;
  }, [focusedView, idx]);

  return (
    <StyledView style={{ transform: `translateX(${-100 * focusedView}%)` }}>
      <Wrapper ref={viewRef}>{children}</Wrapper>
    </StyledView>
  );
};

export default View;
