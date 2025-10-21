"use client";

import styled from "styled-components";
import Story from "./Subpages/story";
import Passion from "./Subpages/passion";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import Work from "./Subpages/work";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type WindowStates = [0, 0, 0] | [1, 0, 0] | [0, 0, 1] | [0, 1, 0] | "initial";

export type TitleProps = {
  // pullMasterTl: GSAPTimeline;
  pulldirectionProp: Dispatch<PullVariants>;
  pullDirection: string;
  currentWindow: RefObject<WindowStates>;
  isAnimating: RefObject<boolean>;
  delayTime: number;
};

type PullVariants = "left" | "mid" | "right" | "default";

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
`;

export default function LowerHalf() {
  const [pullDirection, setPullDirection] = useState<PullVariants>("default");
  // const tl = useRef<GSAPTimeline>(
  //   gsap.timeline({ id: "master", paused: true })
  // );
  const tainer = useRef(null);
  const childTls = useRef<(GSAPTimeline | GSAPTween)[]>(null);
  const currentWindow = useRef<WindowStates>("initial");
  // Animating should actually be false, but it seems to have slipped through and now stuff gets broken if i swap it. Just keep it, doesnt change a thing really.
  const isAnimating = useRef(true);
  const pullDurationOrDelay = 1.2;

  // Aktuelles Problem: Da die master timline pausiert wurde können die unteren nicht abspielen

  // useGSAP(() => {
  //   if (!tl.current) return;

  //   const rightTl = tl.current?.getById("storyRight");

  //   if (pullDirection === "right" && rightTl) {
  //     tl.current.play();
  //     rightTl.play();
  //   }

  //   if (pullDirection === "default") {
  //     tl.current?.getChildren(false, false).forEach((childTl) => {
  //       if (childTl.totalProgress() > 0) {
  //         childTl.reverse();
  //       }
  //     });
  //   }
  // }, [pullDirection]);

  return (
    <Container>
      <Story
        // pullMasterTl={tl.current}
        pulldirectionProp={(str: PullVariants) => setPullDirection(str)}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
      />
      <Passion
        // pullMasterTl={tl.current}
        pulldirectionProp={(str: PullVariants) => setPullDirection(str)}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
      />
      <Work
        // pullMasterTl={tl.current}
        pulldirectionProp={(str: PullVariants) => setPullDirection(str)}
        pullDirection={pullDirection}
        currentWindow={currentWindow}
        delayTime={pullDurationOrDelay}
        isAnimating={isAnimating}
      />
    </Container>
  );
}
