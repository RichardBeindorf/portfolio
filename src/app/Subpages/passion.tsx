"use client";

import styled from "styled-components";
import { ChapterTitle, TitleProps, TitleWrapper } from "./story";
import { oswald300, oswald500, permanentMarker } from "@/styles/font";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/all";

export default function Passion({
  currentWindow,
  animationTime,
  isAnimating,
}: TitleProps) {
  const tainer = useRef(null);
  const title = useRef(null);
  const underline = useRef(null);
  gsap.registerPlugin(DrawSVGPlugin);
  const [clicked, setClicked] = useState(false);
  const currentState = useRef(null);
  const defaultPositionTest = (pos: number) => pos === 0;
  const titleDelay = 1;
  const pullDuration = 1;
  const topDistanceTitle = "54%";
  const leftDistanceTitle = "10%";
  const titleDuration = 1;
  const entriesRef = useRef(null);
  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null);
  const [showEntries, setShowEntries] = useState(false);
  const color = useRef("unset");

  if (clicked) {
    color.current = "#F2F1E9";
  } else {
    color.current = "unset";
  }

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
            // left: ["50%", "48%", "50%"],
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
            setShowEntries(true);
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
            display: "none",
            left: "50%",
            top: "85%",
            duration: pullDuration,
            ease: "power4.in",
            onComplete: () => {
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
            display: "none",
            left: "90%",
            top: "70%",
            duration: pullDuration,
            ease: "power4.in",
            onComplete: () => {
              currentState.current = null; // Clear ref when animation reverses
            },
          });
        } else {
          currentState.current.play();
        }
      });

      const onPullBack = contextSafe(() => {
        const midOut = gsap.to(tainer.current, {
          display: "block",
          duration: animationTime + 1,
          ease: "power4.out",
          fontSize: "clamp(8vw, 6rem, 11vw)",
          scale: 1,
          top: "70%",
          left: "10%",
          opacity: 1,
          rotate: 0,
        });
        return midOut;
      });

      if (currentWindow[1] === 1) {
        onPullMid();
      } else if (currentWindow[2] === 1) {
        onPullRight();
      } else if (currentWindow.every(defaultPositionTest)) {
        onPullBack();
      }
    },
    {
      scope: tainer,
      dependencies: [clicked, currentWindow],
      revertOnUpdate: false,
    }
  );

  //**//
  /* Staggered Animation of the Entries - Managed outside main GSAP context for clarity */
  //**//
  useGSAP(
    () => {
      const items = entriesRef.current
        ? entriesRef.current.querySelectorAll("div")
        : [];
      let shift;

      if (!entryStaggerAnimation.current && items.length > 0) {
        entryStaggerAnimation.current = gsap.from(items, {
          opacity: 0,
          y: 20,
          stagger: 0.03,
          duration: 0.2,
          ease: "power2.out",
          paused: true,
          onReverseComplete: () => {
            setShowEntries(false);
          },
        });
      }
      if (showEntries && entryStaggerAnimation.current) {
        entryStaggerAnimation.current.play();
      }
      if (!clicked && isAnimating.current === true) {
        entryStaggerAnimation.current.reverse();
        entryStaggerAnimation.current = null;
        // Animate the contentWrapper back up when entries are reversing out
        shift = gsap.to(".contentWrapper", {
          y: -60,
          ease: "power2.out",
          duration: 0.4,
        });
        shift.play();
        shift.reverse();
      }

      //**//
      /* Underline Animation */
      //**//

      const drawUnderline = contextSafe(() => {
        gsap.from(underline.current, {
          drawSVG: "0",
          ease: "power1.in",
          delay: 0,
          duration: 0.35,
        });
      });

      if (clicked && !isAnimating.current) {
        drawUnderline();
      }
    },
    {
      scope: tainer,
      dependencies: [showEntries, clicked],
      revertOnUpdate: false,
    }
  );

  return (
    <PassionContainer $backgroundColor={color.current} ref={tainer}>
      <TitleWrapper>
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
        {clicked && !isAnimating.current ? (
          <svg width="650" height="20">
            <path
              ref={underline}
              d="M 0 0 Q 20 20, 500 0"
              stroke="#262626"
              strokeWidth="2.5px"
              fill="transparent"
            />
          </svg>
        ) : null}
      </TitleWrapper>

      <PassionContent className="contentWrapper">
        {clicked ? (
          <div ref={entriesRef}>
            <Subtitle style={permanentMarker.style}>
              What is it that makes me passionate?
            </Subtitle>
            <TopicWrapper style={{ textAlign: "left" }}>
              <Topic style={permanentMarker.style}>Creation</Topic>
              <Text style={oswald300.style}>
                the realization of{" "}
                <Highlights style={oswald500.style}>
                  endless possibilities
                </Highlights>{" "}
                is what made me obsessed with{" "}
                <Highlights style={oswald500.style}>programming</Highlights> -
                what great we can achieve when setting our minds to it
              </Text>
            </TopicWrapper>
            <TopicWrapper style={{ textAlign: "right" }}>
              <Topic style={permanentMarker.style}>life long learning</Topic>
              <Text style={oswald300.style}>
                being able to keep learning is an{" "}
                <Highlights style={oswald500.style}>
                  escape hatch out of mental stiffness
                </Highlights>{" "}
                - trying hard to understand new concepts opens my mind
              </Text>
            </TopicWrapper>
            <TopicWrapper style={{ textAlign: "left" }}>
              <Topic style={permanentMarker.style}>Mastery</Topic>
              <Text style={oswald300.style}>
                trying to keep my perfectionism in the bottle and funneling the
                energy instead into{" "}
                <Highlights style={oswald500.style}>training skills</Highlights>{" "}
                rather than micro optimizations is pushing me - in sports,
                relationships and work
              </Text>
            </TopicWrapper>
            <TopicWrapper style={{ textAlign: "right" }}>
              <Topic style={permanentMarker.style}>Discovery</Topic>
              <Text style={oswald300.style}>
                getting out of my{" "}
                <Highlights style={oswald500.style}>comfort areas</Highlights> -
                if it didn't scare me it probably didn't improve my life
              </Text>
            </TopicWrapper>
          </div>
        ) : null}
      </PassionContent>
    </PassionContainer>
  );
}

const PassionContainer = styled.section<{ $backgroundColor: string }>`
  display: flex;
  position: absolute;
  top: 85%;
  left: 50%;
  text-align: left;
  /* mix-blend-mode: normal; */
  padding: 15px;
  border-radius: 15px;
  background-color: ${(props) => props.$backgroundColor};
  border: 0px solid black;
  border-radius: 25px;
`;

const Title = styled(ChapterTitle)`
  text-align: left;
  margin-left: 30px;
`;

const PassionContent = styled.div``;

const TopicWrapper = styled.div`
  margin-top: 25px;
`;

const Subtitle = styled.div`
  width: max-content;
  font-size: 2rem;
  color: var(--foreground);
`;

const Topic = styled.h3`
  font-size: 2rem;
  color: var(--textAccent);
`;

const Text = styled.p`
  font-size: 1.25rem;
  color: var(--foreground);
`;

const Highlights = styled.span`
  color: var(--textAccent);
`;
