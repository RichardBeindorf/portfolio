"use client";

import styled from "styled-components";
import Story from "./Subpages/story";
import Passion from "./Subpages/passion";
import { Dispatch, RefObject, useRef, useState } from "react";
import Work from "./Subpages/work";

export type TitleProps = {
  pulldirectionProp: Dispatch<PullVariants>;
  currentWindow: RefObject<WindowStates>;
  isAnimating: RefObject<boolean>;
  pullDirection: string;
  delayTime: number;
  resizeDelta: number | null;
};

type WindowStates = [0, 0, 0] | [1, 0, 0] | [0, 0, 1] | [0, 1, 0] | "initial";

type PullVariants = "left" | "mid" | "right" | "default";

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
`;

export default function LowerHalf({
  resizeDelta,
}: {
  resizeDelta: number | null;
}) {
  const [pullDirection, setPullDirection] = useState<PullVariants>("default");
  const currentWindow = useRef<WindowStates>("initial");
  // Animating should actually be false, but it seems to have slipped through and now stuff gets broken if i swap it. Just keep it, doesnt change a thing really.
  const isAnimating = useRef(true);
  const pullDurationOrDelay = 1.2;

  return (
    <Container>
      <Story
        pulldirectionProp={(str: PullVariants) => setPullDirection(str)}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        resizeDelta={resizeDelta}
      />
      <Passion
        pulldirectionProp={(str: PullVariants) => setPullDirection(str)}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        resizeDelta={resizeDelta}
      />
      <Work
        pulldirectionProp={(str: PullVariants) => setPullDirection(str)}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        resizeDelta={resizeDelta}
      />
    </Container>
  );
}
