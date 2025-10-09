"use client";

import styled from "styled-components";
import Story from "./Subpages/story";
import Passion from "./Subpages/passion";
import { useRef } from "react";
import Work from "./Subpages/work";

const Container = styled.div`
  position: relative;
  /* display: flex; */
  /* align-items: stretch; */
  /* justify-content: space-around; */
  /* width: 100%; */

  /* align-items: center; */
  min-height: 100vh;
  width: 100%;
`;

export default function LowerHalf() {
  const currentWindow = useRef<number[]>([]);
  const pullDurationOrDelay = 1.2;
  const isAnimating = useRef(false);
  return (
    <Container>
      <Story
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
      />
      <Passion
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
      />
      <Work
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
      />
    </Container>
  );
}
