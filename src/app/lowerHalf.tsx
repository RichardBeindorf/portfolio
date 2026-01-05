"use client";

import styled from "styled-components";
import Story from "./Subpages/story";
import Passion from "./Subpages/passion";
import { RefObject, useMemo, useRef, useState } from "react";
import Work from "./Subpages/work";
import { PullVariants } from "./page";
import Spacer from "./Subpages/spacer";

export interface TitleProps {
  pullDirectionProp: React.Dispatch<React.SetStateAction<PullVariants>>;
  currentWindow: RefObject<WindowStates>;
  isAnimating: RefObject<boolean>;
  pullDirection: string;
  delayTime: number;
  resizeDelta: number | null;
  positionsObj: PositionSwapper;
  spacerHeight: (spacerHeight: number) => void;
}

export interface TitleConfig {
  config: TitleProps;
}

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

const FlipStage = styled.div`
  position: fixed;
  top: 100vh;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
`;

export default function LowerHalf({
  resizeDelta,
  pullDirectionProp,
  pullDirection,
}: {
  resizeDelta: number | null;
  pullDirectionProp: React.Dispatch<React.SetStateAction<PullVariants>>;
  pullDirection: PullVariants;
}) {
  const [spacerHeight, setSpacerHeight] = useState<number>(null);
  const currentWindow = useRef<WindowStates>("initial");
  // Animating should actually be false, but it seems to have slipped through and now stuff gets broken if i swap it. Just keep it, doesnt change a thing really.
  const isAnimating = useRef(true);
  const positionsObj = useRef<PositionSwapper>(null);
  const delayTime = 1.2;

  if (
    /Android|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) // testing for mobile device
  ) {
    // Positioning title in respect to the screen size
    positionsObj.current = { passion: "6%", story: "35%", work: "70%" };
  } else {
    positionsObj.current = { passion: "10%", story: "45%", work: "80%" };
  }

  const titleConfig: TitleProps = useMemo(
    () => ({
      delayTime,
      resizeDelta,
      isAnimating,
      pullDirection,
      currentWindow,
      pullDirectionProp,
      spacerHeight: setSpacerHeight,
      positionsObj: positionsObj.current,
    }),
    [pullDirection, resizeDelta]
  );

  return (
    <Container>
      <Spacer spacerHeight={spacerHeight} />
      <FlipStage>
        <Story config={titleConfig} />
        <Passion config={titleConfig} />
        <Work config={titleConfig} />
      </FlipStage>
    </Container>
  );
}
