"use client";

import styled from "styled-components";
import { ChapterContainer, ChapterTitle, TitleProps } from "./story";
import { permanentMarker } from "@/styles/font";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const PassionContainer = styled(ChapterContainer)`
  top: 70%;
  left: 90%;
`;

const Title = styled(ChapterTitle)``;

export default function Work({
  currentWindow,
  setCurrentWindow,
  animationTime,
  isAnimating,
}: TitleProps) {
  const tainer = useRef(null);
  const title = useRef(null);
  const [clicked, setClicked] = useState(false);
  const workTL = useRef(null);
  const currentState = useRef(null);
  const defaultPositionTest = (pos: number) => pos === 0;
  const topDistanceTitle = "54%";
  const leftDistanceTitle = "24%";
  const titleDuration = 1;

  const { contextSafe } = useGSAP(
    () => {
      //**//
      /* MAIN TITLE ANIMATION */
      //**//
      const titleTL = contextSafe(() => {
        const newTL = gsap.timeline({
          paused: true,
          ease: "power4.out",
          delay: animationTime,
          // making sure the animation state is preserved all the way so we can disable any click animation while its on
          onComplete: () => {
            isAnimating.current = false;
          },
          onReverseComplete: () => {
            isAnimating.current = false;
            workTL.current = null;
          },
        });
        newTL.to(tainer.current, {
          top: topDistanceTitle,
          left: leftDistanceTitle,
          duration: titleDuration,
        });
        newTL.to(
          title.current,
          {
            fontSize: "clamp(8vw, 6rem, 11vw)",
            color: "#F24150",
            duration: 2,
          },
          "<"
        );
        return newTL;
      });

      if (!workTL.current) {
        // remembering each timeline or we will just creat a new one everytime and cant play or reverse
        workTL.current = titleTL();
      }

      if (workTL.current) {
        if (clicked) {
          workTL.current.play();
        }
        if (!clicked || currentWindow.every(defaultPositionTest)) {
          workTL.current.reverse();
        }
      }

      //**//
      /* ---- END ---- */
      //**//

      const pullDuration = 1;

      const onPullMid = contextSafe(() => {
        gsap.to(tainer.current, {
          id: "midIn",
          display: "none",
          duration: animationTime + 1,
          ease: "power4.out",
          keyframes: {
            // 8 different phases maximum currently
            rotate: [0, 24, 13, 24, 0, 0, -15, 0],
            scale: [1, 1, 1, 1, 0.5, 0.2],
            // first is start position
            top: ["70%", "70%", "85%", "85%"],
            left: ["90%", "89%", "88%", "75%", "50%"],
            opacity: [1, 1, 1, 1, 1, 1, 1, 0],
            easeEach: "none",
          },
        });
      });

      const onPullMidOut = contextSafe(() => {
        const midOut = gsap.to(tainer.current, {
          display: "block",
          duration: animationTime + 1,
          ease: "power4.out",
          scale: 1,
          top: "70%",
          left: "90%",
          opacity: 1,
          rotate: 0,
        });

        return midOut;
      });

      const onPullLeft = contextSafe(() => {
        const leftIn = gsap.to(tainer.current, {
          id: "leftIn",
          display: "none",
          // scale: 0.1,
          // rotate: -30,
          // left: "10%",
          top: "70%",
          keyframes: {
            // 8 different phases maximum currently
            rotate: [0, 24, 13, 24, 0, 0, -15, 0],
            scale: [1, 1, 1, 1, 0.5, 0.2],
            // first is start position
            // top: ["70%", "70%", "85%", "85%"],
            left: ["90%", "89%", "88%", "75%", "10%"],
            opacity: [1, 1, 1, 1, 1, 1, 1, 0],
            easeEach: "none",
          },
          duration: pullDuration,
          ease: "power4.out",
        });

        return leftIn;
      });

      if (currentWindow[0] === 1) {
        onPullLeft();
      }

      if (currentWindow[1] === 1) {
        onPullMid();
        currentState.current = null;
      }

      if (currentWindow.every(defaultPositionTest)) {
        onPullMidOut();
      }
      // clearing the timeline shortly after giving the command to revers to prevent errors
      currentState.current = null;
    },
    {
      scope: tainer,
      dependencies: [clicked, currentWindow],
      revertOnUpdate: false,
    }
  );

  return (
    <PassionContainer
      onClick={() => {
        if (isAnimating.current === false) {
          const next = !clicked;
          setClicked(next);
          setCurrentWindow(next ? [0, 0, 1] : [0, 0, 0]);
          isAnimating.current = true;
        }
      }}
      ref={tainer}
    >
      <Title style={permanentMarker.style} ref={title}>
        Work
      </Title>
    </PassionContainer>
  );
}
