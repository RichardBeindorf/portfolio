"use client";

import styled from "styled-components";
import { ChapterContainer, ChapterTitle, CurrentWindow } from "./story";
import { permanentMarker } from "@/styles/font";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const PassionContainer = styled(ChapterContainer)`
  left: 90%;
  top: 70%;
`;

const Title = styled(ChapterTitle)``;

export default function Work({
  currentWindow,
  setCurrentWindow,
}: CurrentWindow) {
  const tainer = useRef(null);
  const title = useRef(null);
  const [clicked, setClicked] = useState(false);
  const workTimeline = useRef(null);
  const currentState = useRef(null);
  const defaultPositionTest = (pos: number) => pos === 0;

  const { contextSafe } = useGSAP(
    () => {
      //**//
      /* MAIN TITLE ANIMATION */
      //**//

      const titleTL = contextSafe(() => {
        const newTL = gsap.timeline({ paused: true, ease: "power4.out" });
        newTL.to(tainer.current, {
          top: "60%",
          duration: 2,
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

      if (!workTimeline.current) {
        workTimeline.current = titleTL();
      }

      if (workTimeline.current) {
        if (clicked) {
          workTimeline.current.play();
        }
        if (!clicked || currentWindow.every(defaultPositionTest)) {
          workTimeline.current.reverse();
        }
      }

      //**//
      /* ---- END ---- */
      //**//

      const pullDuration = 0.5;

      const onPullMid = contextSafe(() => {
        // console.log("MID");
        gsap.to(tainer.current, {
          scale: 0.1,
          rotate: 30,
          left: "50%",
          top: "85%",
          duration: pullDuration,
          ease: "power4.out",
        });
      });

      const onPullLeft = contextSafe(() => {
        // console.log("LEFT");
        gsap.to(tainer.current, {
          scale: 0.1,
          rotate: -30,
          left: "10%",
          top: "85%",
          duration: pullDuration,
          ease: "power4.out",
        });
      });

      // const backToStart = contextSafe(() => {
      //   gsap.to(tainer.current, {
      //     left: "90%",
      //     top: "70%",
      //   });
      // });

      if (currentWindow[0] === 1) {
        currentState.current = onPullLeft();
        // console.log("LEFT CALL");
      } else if (currentWindow[1] === 1) {
        currentState.current = onPullMid();
        // console.log("MID CALL", clicked, currentWindow);
      } else if (
        currentWindow.every(defaultPositionTest) &&
        currentState.current
      ) {
        currentState.current.reverse();
        setTimeout(() => {
          currentState.current = null;
        }, 2000);
        // console.log("NO CALL");
      }
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
        const next = !clicked;
        setClicked(next);
        setCurrentWindow(next ? [0, 0, 1] : [0, 0, 0]);
      }}
      ref={tainer}
    >
      <Title style={permanentMarker.style} ref={title}>
        Work
      </Title>
    </PassionContainer>
  );
}
