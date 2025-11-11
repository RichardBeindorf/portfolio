"use client";

import styled from "styled-components";
import Story from "./Subpages/story";
import Passion from "./Subpages/passion";
import { Dispatch, RefObject, useRef, useState } from "react";
import Work from "./Subpages/work";
import { PullVariants } from "./page";

export type TitleProps = {
  pulldirectionProp: React.Dispatch<React.SetStateAction<PullVariants>>;
  currentWindow: RefObject<WindowStates>;
  isAnimating: RefObject<boolean>;
  pullDirection: string;
  delayTime: number;
  resizeDelta: number | null;
};

type WindowStates = [0, 0, 0] | [1, 0, 0] | [0, 0, 1] | [0, 1, 0] | "initial";

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
  const pullDurationOrDelay = 1.2;

  return (
    <Container>
      <Story
        pulldirectionProp={pulldirectionProp}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        resizeDelta={resizeDelta}
      />
      <Passion
        pulldirectionProp={pulldirectionProp}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        resizeDelta={resizeDelta}
      />
      <Work
        pulldirectionProp={pulldirectionProp}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
        resizeDelta={resizeDelta}
      />
    </Container>
  );
}
