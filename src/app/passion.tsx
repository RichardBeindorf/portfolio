import styled from "styled-components";
import { ChapterContainer, ChapterTitle, TitleProps } from "./story";
import { permanentMarker } from "@/styles/font";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const PassionContainer = styled(ChapterContainer)`
  left: 10%;
  top: 70%;
`;

const Title = styled(ChapterTitle)``;

export default function Passion({
  currentWindow,
  setCurrentWindow,
  animationTime,
  isAnimating,
}: TitleProps) {
  const tainer = useRef(null);
  const title = useRef(null);
  const [clicked, setClicked] = useState(false);
  const passionTL = useRef(null);
  const currentState = useRef(null);
  const defaultPositionTest = (pos: number) => pos === 0;

  const { contextSafe } = useGSAP(
    () => {
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
            passionTL.current = null;
          },
        });
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

      if (!passionTL.current) {
        passionTL.current = titleTL();
      }

      if (passionTL.current) {
        if (clicked) {
          passionTL.current.play();
        }
        if (!clicked || currentWindow.every(defaultPositionTest)) {
          passionTL.current.reverse();
          passionTL.current = null;
        }
      }

      //**//
      /* ---- END ---- */
      //**//

      const pullDuration = 0.5;

      const onPullMid = contextSafe(() => {
        const minIn = gsap.to(tainer.current, {
          scale: 0.1,
          rotate: 30,
          left: "50%",
          top: "85%",
          duration: pullDuration,
          ease: "power4.out",
        });

        return minIn;
      });

      const onPullLeft = contextSafe(() => {
        const leftIn = gsap.to(tainer.current, {
          scale: 0.1,
          rotate: -30,
          left: "90%",
          top: "70%",
          duration: pullDuration,
          ease: "power4.out",
        });

        return leftIn;
      });

      if (currentWindow[2] === 1 && !currentState.current) {
        currentState.current = onPullLeft();
      }

      if (currentWindow[1] === 1 && !currentState.current) {
        currentState.current = onPullMid();
      }

      if (currentState.current && currentWindow.every(defaultPositionTest)) {
        currentState.current.reverse();
        setTimeout(() => {
          currentState.current = null;
        }, 501);
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
        if (isAnimating.current === false) {
          const next = !clicked;
          setClicked(next);
          setCurrentWindow(next ? [1, 0, 0] : [0, 0, 0]);
          isAnimating.current = true;
        }
      }}
      ref={tainer}
    >
      <Title style={permanentMarker.style} ref={title}>
        Passion
      </Title>
    </PassionContainer>
  );
}
