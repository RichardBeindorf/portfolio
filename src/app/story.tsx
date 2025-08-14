"use client";

import styled from "styled-components";
import { permanentMarker, oswald300, oswald500 } from "../styles/font";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Entry from "./entry";

export type TitleProps = {
  currentWindow: number[];
  setCurrentWindow: Dispatch<SetStateAction<number[]>>;
  animationTime: number;
  isAnimating: RefObject<boolean>;
};

export const ChapterContainer = styled.section`
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translateX(-50%);
  mix-blend-mode: normal;
  padding: 15px;
  border-radius: 15px;
`;

export const ChapterTitle = styled.h1`
  color: var(--foreground);
  mix-blend-mode: normal;
  font-size: clamp(2vw, 3rem, 4.5vw);
  text-align: center;
  user-select: none;

  &:hover {
    cursor: pointer;
  }
`;

const Intro = styled.h2`
  min-width: max-content;
`;

const EntryList = styled.div`
  margin-top: 30px;
`;

export default function Story({
  currentWindow,
  setCurrentWindow,
  animationTime,
  isAnimating,
}: TitleProps) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [showEntries, setShowEntries] = useState(false);
  const title = useRef(null);
  const tainer = useRef(null);
  const storyTimeline = useRef<gsap.core.Timeline | null>(null);
  const currentState = useRef<gsap.core.Tween | null>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null); // To store the entry stagger animation
  const defaultPositionTest = (pos: number) => pos === 0;
  const pullDuration = 1;
  const titleDuration = 1;
  const topDistanceTitle = "54%";
  const leftDistanceTitle = "24%";

  const entryData = [
    [
      "From a disillusioned logistics trainee to become an aspiring actor ..",
      "2008",
    ],
    [
      "From dreaming actor to a curios student of the Media- and Communication Science ..",
      "2013",
    ],
    [
      "On to craft mind blowing video advertisments and find a way into film making ..",
      "2016",
    ],
    ["To tipping his toes into the corporate jungle ..", "2024"],
    [
      "and .. finally .. realizing his full potential in web development",
      "now",
    ],
  ];

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
            left: ["50%", "48%", "50%"],
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
          display: "none",
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
          display: "none",
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
          top: "85%",
          left: "50%",
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
    },
    {
      scope: tainer,
      dependencies: [showEntries, clicked],
      revertOnUpdate: false,
    }
  );

  return (
    <ChapterContainer ref={tainer}>
      <ChapterTitle
        style={permanentMarker.style}
        onClick={() => {
          if (isAnimating.current === false) {
            const next = !clicked;
            setClicked(next);
            setCurrentWindow(next ? [0, 1, 0] : [0, 0, 0]);
            isAnimating.current = true;
            console.log(isAnimating.current, currentWindow);
          }
        }}
        ref={title}
      >
        Story
      </ChapterTitle>
      <div className="contentWrapper">
        {showEntries ? ( // Use showEntries here
          <>
            <Intro style={oswald300.style}>
              ”Lets say it seems <em style={oswald500.style}>complicated</em>,
              but in the <em style={oswald500.style}>end</em> it all makes
              sense”
            </Intro>
            <EntryList ref={entriesRef}>
              {entryData.map((entry, i) => Entry(entry[0], entry[1], i))}
            </EntryList>
          </>
        ) : null}
      </div>
    </ChapterContainer>
  );
}
