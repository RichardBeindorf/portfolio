"use client";

import styled from "styled-components";
import Story from "./Subpages/story";
import Passion from "./Subpages/passion";
import { useRef, useState } from "react";
import Work from "./Subpages/work";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export default function LowerHalf() {
  const [currentWindow, setCurrentWindow] = useState<number[]>([]);
  const pullDurationOrDelay = 1.2;
  const isAnimating = useRef(false);
  return (
    <Container>
      <Story
        currentWindow={currentWindow}
        animationTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        setCurrentWindow={(arr) => setCurrentWindow(arr)}
      />
      <Passion
        currentWindow={currentWindow}
        animationTime={pullDurationOrDelay}
        setCurrentWindow={(arr) => setCurrentWindow(arr)}
        isAnimating={isAnimating}
      />
      <Work
        currentWindow={currentWindow}
        animationTime={pullDurationOrDelay}
        setCurrentWindow={(arr) => setCurrentWindow(arr)}
        isAnimating={isAnimating}
      />
    </Container>
  );
}
