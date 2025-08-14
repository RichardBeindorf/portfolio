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
  const currentState = useRef(null);
  const defaultPositionTest = (pos: number) => pos === 0;
  const titleDelay = 1;
  const pullDuration = 1;
  const topDistanceTitle = "54%";
  const leftDistanceTitle = "24%";
  const titleDuration = 1;

  const { contextSafe } = useGSAP(
    () => {
      //**//
      /* ONLY ONCE PER CYCLE (Bounce animation to illustrate the impact of other title crasing into it) */
      //**//
      const onStartBounce = contextSafe(() => {
        gsap.to(title.current, {
          delay: 0.5,
          ease: "sine.in",
          duration: titleDuration,
          keyframes: {
            scaleX: ["100%", "80%", "100%"],
            left: ["50%", "48%", "50%"],
            rotate: [0, -10, 0],
            easeEach: "none",
          },
        });
      });

      //**//
      /* MAIN TITLE ANIMATION */
      //**//

      if (clicked) {
        if (isAnimating.current) {
          // Only trigger bounce if an animation is truly in progress
          onStartBounce();
        }

        gsap.to(tainer.current, {
          top: topDistanceTitle,
          left: leftDistanceTitle,
          ease: "power4.out",
          onComplete: () => {
            isAnimating.current = false;
          },
          duration: titleDelay,
          delay: animationTime,
        });
        gsap.to(title.current, {
          duration: titleDelay,
          delay: animationTime,
          fontSize: "clamp(8vw, 6rem, 11vw)",
          ease: "power4.out",
          onComplete: () => {
            isAnimating.current = false;
          },
          keyframes: {
            color: ["#262626", "#F24150"],
          },
        });
      } else if (
        !clicked &&
        currentWindow.every(defaultPositionTest) &&
        isAnimating.current
      ) {
        // Only reverse if we unclicked AND go back to default window position
        gsap.to(tainer.current, {
          left: "10%",
          top: "70%",
          duration: titleDelay,
          ease: "power4.out",
          onStart: () => {
            isAnimating.current = false;
          },
        });
        gsap.to(title.current, {
          fontSize: "clamp(2vw, 3rem, 4.5vw)",
          color: "var(--foreground)",
          duration: titleDelay,
        });
      }

      //**//
      /* ---- END ---- */
      //**//

      const onPullMid = contextSafe(() => {
        if (!currentState.current) {
          currentState.current = gsap.to(tainer.current, {
            scale: 0.1,
            rotate: 30,
            left: "50%",
            top: "85%",
            duration: pullDuration,
            ease: "power4.in",
            onReverseComplete: () => {
              currentState.current = null; // Clear ref when animation reverses
            },
          });
        } else {
          currentState.current.play();
        }
      });

      const onPullRight = contextSafe(() => {
        if (!currentState.current) {
          currentState.current = gsap.to(tainer.current, {
            scale: 0.1,
            rotate: 30,
            left: "90%",
            top: "70%",
            duration: pullDuration,
            ease: "power4.in",
            onReverseComplete: () => {
              currentState.current = null; // Clear ref when animation reverses
            },
          });
        } else {
          currentState.current.play();
        }
      });

      if (currentWindow[1] === 1) {
        onPullMid();
      } else if (currentWindow[2] === 1) {
        onPullRight();
      } else if (
        currentState.current &&
        currentWindow.every(defaultPositionTest)
      ) {
        currentState.current.reverse();
      }
    },
    {
      scope: tainer,
      dependencies: [clicked, currentWindow],
      revertOnUpdate: false,
    }
  );

  return (
    <PassionContainer ref={tainer}>
      <Title
        style={permanentMarker.style}
        onClick={() => {
          if (isAnimating.current === false) {
            const next = !clicked;
            setClicked(next);
            setCurrentWindow(next ? [1, 0, 0] : [0, 0, 0]);
            isAnimating.current = true;
          }
        }}
        ref={title}
      >
        Passion
      </Title>
    </PassionContainer>
  );
}
