import { MutableRefObject, useCallback, useRef, useState } from "react";

const useTimelineScroll = (
  views: number,
  throttle: number,
  predicate?: () => boolean
): [
    MutableRefObject<boolean>,
    (_direction: number) => void,
    number,
    (_focusedView: number) => void
  ] => {
  const [focusedView, _setFocusedView] = useState(0);
  const scrolling = useRef(false);

  const setFocusedView = useCallback(
    (focusedView: number) => {
      _setFocusedView(focusedView);
      scrolling.current = true;
      setTimeout(() => {
        scrolling.current = false;
      }, throttle);
    },
    [throttle]
  );

  const handleScroll = useCallback(
    (direction: number) => {
      if (predicate?.()) {
        return;
      }

      if (direction < 0 && focusedView > 0) {
        setFocusedView(focusedView - 1);
      } else if (direction > 0 && focusedView < views - 1) {
        setFocusedView(focusedView + 1);
      }
    },
    [focusedView, views, predicate, setFocusedView]
  );

  return [scrolling, handleScroll, focusedView, setFocusedView];
};

export default useTimelineScroll;