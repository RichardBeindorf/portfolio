"use client";

import styled from "styled-components";
import Story from "./Subpages/story";
import Passion from "./Subpages/passion";
import { RefObject, useRef } from "react";
import Work from "./Subpages/work";
import { PullVariants } from "./page";

export type TitleProps = {
  pulldirectionProp: React.Dispatch<React.SetStateAction<PullVariants>>;
  currentWindow: RefObject<WindowStates>;
  isAnimating: RefObject<boolean>;
  pullDirection: string;
  delayTime: number;
  resizeDelta: number | null;
  positionsObj: PositionSwapper;
};

type WindowStates = [0, 0, 0] | [1, 0, 0] | [0, 0, 1] | [0, 1, 0] | "initial";

type PositionSwapper = {
  passion: string;
  story: string;
  work: string;
};

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
`;

export default function LowerHalf({
  resizeDelta,
  pulldirectionProp,
  pullDirection,
}: {
  resizeDelta: number | null;
  pulldirectionProp: React.Dispatch<React.SetStateAction<PullVariants>>;
  pullDirection: PullVariants;
}) {
  const currentWindow = useRef<WindowStates>("initial");
  // Animating should actually be false, but it seems to have slipped through and now stuff gets broken if i swap it. Just keep it, doesnt change a thing really.
  const isAnimating = useRef(true);
  const positions = useRef<PositionSwapper>(null);
  const pullDurationOrDelay = 1.2;

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) // testing for mobile device
  ) {
    positions.current = { passion: "6%", story: "35%", work: "60%" };
  } else {
    positions.current = { passion: "10%", story: "45%", work: "80%" };
  }

  return (
    <Container>
      <Story
        pulldirectionProp={pulldirectionProp}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        resizeDelta={resizeDelta}
        positionsObj={positions.current}
      />
      <Passion
        pulldirectionProp={pulldirectionProp}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        resizeDelta={resizeDelta}
        positionsObj={positions.current}
      />
      <Work
        pulldirectionProp={pulldirectionProp}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        resizeDelta={resizeDelta}
        positionsObj={positions.current}
      />
    </Container>
  );
}
