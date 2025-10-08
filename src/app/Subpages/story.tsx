"use client";

import styled from "styled-components";
import { permanentMarker, oswald300, oswald500 } from "../../styles/font";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { entryData } from "@/data/storyEntries";
import { DrawSVGPlugin } from "gsap/all";

export type TitleProps = {
  currentWindow: number[];
  animationTime: number;
  isAnimating: RefObject<boolean>;
};

export default function Story({
  currentWindow,
  animationTime,
  isAnimating,
}: TitleProps) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [showEntries, setShowEntries] = useState(false);
  const title = useRef(null);
  const titleWrapper = useRef(null);
  const tainer = useRef(null);
  const underline = useRef(null);
  gsap.registerPlugin(DrawSVGPlugin);
  const storyTimeline = useRef<gsap.core.Timeline | null>(null);
  const currentState = useRef<gsap.core.Tween | null>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null); // To store the entry stagger animation
  const defaultPositionTest = (pos: number) => pos === 0;
  const pullDuration = 1;
  const titleDuration = 1;
  const topDistanceTitle = "54%";
  const leftDistanceTitle = "25%";
  const color = useRef("unset");

  if (clicked) {
    color.current = "#F2F1E9";
  } else {
    color.current = "unset";
  }

  const { contextSafe } = useGSAP(
    () => {
      //**//
      /* MAIN TITLE ANIMATION */
      //**//
      if (!storyTimeline.current) {
        storyTimeline.current = gsap.timeline({
          paused: true,
          ease: "power4.out",
          onComplete: () => {
            isAnimating.current = false;
            setShowEntries(true); // Toggle entries when main animation is done
          },
        });
        storyTimeline.current
          .to(tainer.current, {
            top: topDistanceTitle,
            left: leftDistanceTitle,
            duration: titleDuration,
            delay: animationTime,
          })
          .to(
            title.current,
            {
              fontSize: "clamp(8vw, 6rem, 11vw)",
              duration: titleDuration,
              keyframes: {
                color: ["#262626", "#F24150"],
              },
            },
            "<"
          );
        // .to(
        //   titleWrapper.current,
        //   {
        //     // x: "-20%",
        //     // textAlign: "left",
        //   },
        //   "<"
        // );
      }

      //**//
      /* ONLY ONCE PER CYCLE (Bounce animation) */
      //**//
      const onStartBounce = contextSafe(() => {
        gsap.to(title.current, {
          delay: 0.5,
          ease: "sine.in",
          keyframes: {
            scaleX: ["100%", "80%", "100%"],
            // left: ["50%", "48%", "50%"],
            rotate: [0, -10, 0],
            easeEach: "none",
          },
        });
      });

      // CONTROLL LOGIC
      if (clicked) {
        storyTimeline.current.play();
        if (isAnimating.current) {
          // Only trigger bounce if an animation is truly in progress
          onStartBounce();
        }
      } else if (
        !clicked &&
        currentWindow.every(defaultPositionTest) &&
        isAnimating.current
      ) {
        // Only reverse if not clicked AND back to default window position
        gsap.to(tainer.current, {
          top: "85%",
          left: "50%",
          duration: titleDuration,
          ease: "power4.out",
          onStart: () => {
            isAnimating.current = false;
            storyTimeline.current = null;
          },
        });
        gsap.to(title.current, {
          fontSize: "clamp(2vw, 3rem, 4.5vw)",
          color: "var(--foreground)",
          duration: titleDuration,
        });
      }

      //**//
      /* Secondary Title Animation (Pull Left/Right) */
      //**//

      const onPullLeft = contextSafe(() => {
        gsap.to(tainer.current, {
          scale: 0.1,
          // display: "none",
          opacity: 0,
          rotate: -30,
          left: "10%",
          top: "70%",
          duration: pullDuration,
          ease: "power4.out",
          onReverseComplete: () => {
            currentState.current = null; // Clear ref when animation reverses
          },
        });
      });

      const onPullRight = contextSafe(() => {
        gsap.to(tainer.current, {
          scale: 0.1,
          rotate: 30,
          // display: "none",
          opacity: 0,
          left: "90%",
          top: "70%",
          duration: pullDuration,
          ease: "power4.in",
          onReverseComplete: () => {
            currentState.current = null; // Clear ref when animation reverses
          },
        });
      });

      const onPullBack = contextSafe(() => {
        const midOut = gsap.to(tainer.current, {
          display: "block",
          duration: animationTime + 1,
          ease: "power4.out",
          scale: 1,
          // top: "85%",
          // left: "50%",
          opacity: 1,
          rotate: 0,
        });
        return midOut;
      });

      if (currentWindow[0] === 1) {
        onPullLeft();
      } else if (currentWindow[2] === 1) {
        onPullRight();
      } else if (currentWindow.every(defaultPositionTest)) {
        onPullBack();
      }

      //**//
      /* Unerline Animation */
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
      dependencies: [clicked, currentWindow, isAnimating],
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
      /* Unerline Animation */
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
    <ChapterContainer $backgroundColor={color.current} ref={tainer}>
      <TitleWrapper ref={titleWrapper}>
        <ChapterTitle
          style={permanentMarker.style}
          onClick={() => {
            if (isAnimating.current === false) {
              const next = !clicked;
              setClicked(next);
              setCurrentWindow(next ? [0, 1, 0] : [0, 0, 0]);
              isAnimating.current = true;
            }
          }}
          ref={title}
        >
          Story
        </ChapterTitle>
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
      {clicked && ( // Use showEntries here
        <StoryEntryWrapper className="contentWrapper" ref={entriesRef}>
          <Intro style={oswald300.style}>
            ”Lets say it seems <em style={oswald500.style}>complicated</em>, but
            in the <em style={oswald500.style}>end</em> it all makes sense”
          </Intro>
          <EntryList>
            {entryData.map((entry, i) => (
              <EntryWrapper key={i}>
                <Bullet>//</Bullet>
                <EntryText style={oswald300.style}>{entry[0]}</EntryText>
                <Year style={permanentMarker.style}>{entry[1]}</Year>
              </EntryWrapper>
            ))}
          </EntryList>
        </StoryEntryWrapper>
      )}
    </ChapterContainer>
  );
}

const ChapterContainer = styled.section<{ $backgroundColor?: string }>`
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

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: min-content;
  margin-bottom: 5vh;
`;

export const ChapterTitle = styled.h1`
  position: relative;
  color: var(--foreground);
  mix-blend-mode: normal;
  font-size: clamp(2vw, 3rem, 4.5vw);
  text-align: center;
  user-select: none;

  &:hover {
    cursor: pointer;
  }
`;

const StoryEntryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0px;
  background-color: var(--background);
`;

export const Intro = styled.div`
  /* width: max-content; */
  font-size: 2rem;
  text-align: center;
  color: var(--foreground);
`;

export const EntryList = styled.div`
  margin-top: 30px;
`;

const EntryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 0.5rem;
  margin: 10px 0 10px 0;
  cursor: pointer;
  padding: 0px;
  background-color: rgba(242, 241, 233, 0);
  transition: padding 1s ease-in, background-color 1s ease-in,
    font-size 1s ease-in;

  &:hover {
    padding: 5px;
    background-color: rgba(242, 241, 233, 1);
    font-size: clamp(1vw, 1.1rem, 2vw);
    transition: padding 0.5s ease-out, background-color 0.5s ease-out,
      font-size 0.5s ease-out;
  }
`;

const Bullet = styled.span`
  color: var(--textAccent);
  font-size: 2rem;
`;

const EntryText = styled.p`
  /* width: max-content; */
  font-size: 1.5rem;
`;

const Year = styled.span`
  font-size: 1.2rem;
`;
