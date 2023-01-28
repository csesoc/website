import { PropsWithChildren, useEffect, useRef } from "react";
import styled from "styled-components";
import { device } from "../../../styles/device";
import { ViewProps } from "./types";

const Wrapper = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
`;

const StyledView = styled.article`
  display: flex;
  flex-basis: 100%;
  flex-shrink: 0;
  transition: transform 1.25s;
  outline: none;

  @media ${device.laptop} {
    padding: 2rem;
  }

  :focus-visible ${Wrapper} {
    border-color: hsl(248, 50%, 81%);
    box-shadow: 0 0 0 3px hsla(248, 50%, 81%, 0.4);
  }
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
      id={`step${idx}-panel`}
      aria-hidden={idx !== focusedView}
      aria-labelledby={`step${idx}-tab`}
      style={{ transform: `translateX(${-100 * focusedView}%)` }}
      tabIndex={idx === focusedView ? 0 : -1}
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
