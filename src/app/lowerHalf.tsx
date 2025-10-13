"use client";

import styled from "styled-components";
import Story from "./Subpages/story";
import Passion from "./Subpages/passion";
import { RefObject, useRef } from "react";
import Work from "./Subpages/work";

type WindowStates = [0, 0, 0] | [1, 0, 0] | [0, 0, 1] | [0, 1, 0] | "initial";

export type TitleProps = {
  currentWindow: RefObject<WindowStates>;
  delayTime: number;
  isAnimating: RefObject<boolean>;
};

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
  const currentWindow = useRef<WindowStates>("initial");
  const pullDurationOrDelay = 1.2;
  // Animating should actually be false, but it seems to have slipped through and now stuff gets broken if i swap it. Just keep it, doesnt change a thing really.
  const isAnimating = useRef(true);
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
