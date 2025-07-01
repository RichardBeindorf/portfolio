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

  const { contextSafe } = useGSAP(
    () => {
      const onClickIn = contextSafe(() => {
        gsap.to(tainer.current, {
          top: "60%",
          duration: 2,
          //   backgroundColor: "rgba(242, 241, 233, 0.8)",
          ease: "power4.out",
        });
        gsap.to(title.current, {
          fontSize: "clamp(8vw, 6rem, 11vw)",
          color: "#F24150",
          duration: 2,
          ease: "power4.out",
        });
      });

      const onClickOut = contextSafe(() => {
        console.log("OUT");
        gsap.to(tainer.current, {
          top: "85%",
          left: "90%",
          scale: 1,
          duration: 2,
          ease: "power4.out",
          //   backgroundColor: "rgba(242, 241, 233, 0)",
        });
        gsap.to(title.current, {
          fontSize: "clamp(2vw, 3rem, 4.5vw)",
          color: "#262626",
          duration: 2,
          ease: "power4.out",
        });
      });

      const onPullMid = contextSafe(() => {
        // console.log("MID");
        gsap.to(tainer.current, {
          scale: 0.1,
          rotate: 30,
          left: "50%",
          top: "85%",
          duration: 0.5,
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
          duration: 0.5,
          ease: "power4.out",
        });
      });

      const defaultPositionTest = (pos: number) => pos === 0;
      if (clicked) {
        onClickIn();
      }
      console.log(currentWindow, currentWindow.every(defaultPositionTest));
      if (!clicked && currentWindow.every(defaultPositionTest)) {
        onClickOut();
      }

      if (currentWindow[0] === 1) {
        onPullLeft();
        // console.log("LEFT CALL");
      } else if (currentWindow[1] === 1) {
        onPullMid();
        // console.log("MID CALL", clicked, currentWindow);
      } else if (currentWindow.every(defaultPositionTest)) {
        onClickOut();
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
