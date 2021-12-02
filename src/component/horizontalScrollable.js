import { useState, useRef, useEffect, useCallback } from "react";
import Button from "component/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
const Clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const isScrollable = function (ele) {
  return ele.scrollLeftMax > 0;
};

var smoothScroll = function (element, direction = "left") {
  var MIN_PIXELS_PER_STEP = 1;
  var MAX_SCROLL_STEPS = 1000;
  var scrollContainer = element;

  let targetX, targetStep;

  if (direction === "left") {
    targetX = 0;
    targetStep = -32;
  }

  if (direction === "right") {
    targetX = 0;
    targetStep = 32;
  }

  var stepFunc = function (timestamp) {
    scrollContainer.scrollLeft += targetStep;
    if (direction == "left" && scrollContainer.scrollLeft <= targetX) {
      return;
    }
    if (
      direction == "right" &&
      scrollContainer.scrollLeft >= scrollContainer.scrollLeftMax
    ) {
      return;
    }
    window.requestAnimationFrame(stepFunc);
  };

  window.requestAnimationFrame(stepFunc);
};

const MIN_SCROLL = 18;

export default function HorizontalScrollable(props) {
  const [dragging, setDragging] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [next, setNext] = useState(true);
  const [prev, setPrev] = useState(false);
  const scrollerRef = useRef(null);

  const handleMouseDown = useCallback(
    (e) => {
      setDragging(true);
      setOrigin({
        // The current scroll
        left: e.currentTarget.scrollLeft,
        // Get the current mouse position
        x: e.clientX,
      });
    },
    [setDragging, setOrigin]
  );

  const handleMouseUp = useCallback(
    (e) => {
      setDragging(false);
    },
    [setDragging]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (dragging) {
        const dx = e.clientX - origin.x;
        // Scroll the element
        scrollerRef.current.scrollLeft = origin.left - dx;
      }
    },
    [origin, dragging, scrollerRef.current]
  );

  const handleScroll = useCallback(
    (e) => {
      const distance = e.target.scrollLeft;
      const maxDistance = e.target.scrollLeftMax;

      if (!prev && distance > MIN_SCROLL) {
        setPrev(true);
      }
      if (prev && distance < MIN_SCROLL) {
        setPrev(false);
      }
      if (!next && distance < maxDistance) {
        setNext(true);
      }

      if (next && distance === maxDistance) {
        setNext(false);
      }
    },
    [next, prev, setNext, setPrev]
  );

  const handleResize = useCallback(
    (e) => {
      handleScroll({ target: scrollerRef.current });
    },
    [handleScroll, scrollerRef.current]
  );

  const handleClickNext = useCallback(
    (e) => {
      smoothScroll(scrollerRef.current, "right");
    },
    [smoothScroll, scrollerRef.current]
  );

  const handleClickPrev = useCallback(
    (e) => {
      smoothScroll(scrollerRef.current, "left");
    },
    [smoothScroll, scrollerRef.current]
  );

  useEffect(() => {
    if (scrollerRef.current) {
      if (!isScrollable(scrollerRef.current)) {
        setNext(false);
        setPrev(false);
      }
    }
  }, [scrollerRef.current, setPrev, setNext]);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div className={"horizontal-scrollable"}>
      <Button
        onClick={handleClickPrev}
        icon={ChevronLeft}
        className={
          "horizontal-scrollable__button horizontal-scrollable__button--left"
        }
        disabled={!prev}
      />
      <Button
        icon={ChevronRight}
        onClick={handleClickNext}
        className={
          "horizontal-scrollable__button horizontal-scrollable__button--right"
        }
        disabled={!next}
      />
      <div className={"horizontal-scrollable__container"}>
        <div
          className={"horizontal-scrollable__scroller"}
          ref={scrollerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
