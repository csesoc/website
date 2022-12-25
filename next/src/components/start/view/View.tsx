import { PropsWithChildren, useEffect, useRef } from "react";
import styled from "styled-components";
import { ViewProps } from "./types";

const StyledView = styled.article`
  display: flex;
  flex-basis: 100%;
  flex-shrink: 0;
  transition: transform 1.25s;
`;

const Wrapper = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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

    if (previousFocusedView.current === idx) {
      viewRef.current?.animate(
        { transform: "translateY(2rem) scale(0.9)" },
        { duration: 1250, easing: "ease" },
      );
    } else {
      viewRef.current?.animate(
        [{ transform: "translateY(2rem) scale(0.9)" }, { transform: "none" }],
        {
          duration: 1250,
          easing: "ease",
        },
      );
    }

    previousFocusedView.current = focusedView;
  }, [focusedView, idx]);

  return (
    <StyledView
      style={{ transform: `translateX(${-100 * focusedView}%)` }}
      aria-hidden={idx !== focusedView}
    >
      <Wrapper ref={viewRef}>
        {children}
        {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. */}
      </Wrapper>
    </StyledView>
  );
};

export default View;
