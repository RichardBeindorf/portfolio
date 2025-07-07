"use client";

import styled from "styled-components";
import {
  permanentMarker,
  oswald300,
  oswald400,
  oswald500,
} from "../styles/font";
import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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

const Bullet = styled.span`
  color: var(--textAccent);
  font-size: 2rem;
`;

const EntryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 0.5rem;
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

const EntryList = styled.div`
  margin-top: 30px;
`;

const EntryText = styled.p`
  width: max-content;
`;

const Year = styled.span`
  font-size: 1.2rem;
`;

function Entry(
  body: string,
  year: number | string,
  id: number
  // clicked: boolean
) {
  // const handleDelay = useRef(false);
  // if (clicked) {
  //   setTimeout(() => {
  //     handleDelay.current = true;
  //   }, 2);
  // }
  // if (!clicked) {
  //   handleDelay.current = false;
  // }
  return (
    <div key={id}>
      <EntryWrapper>
        <Bullet>//</Bullet>
        <EntryText style={oswald300.style}>{body}</EntryText>
        <Year style={permanentMarker.style}>{year}</Year>
      </EntryWrapper>
    </div>
  );
}

export default function Story({
  currentWindow,
  setCurrentWindow,
  animationTime,
  isAnimating,
}: TitleProps) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [delayedEntry, setDelayedEntry] = useState(false);
  const title = useRef(null);
  const tainer = useRef(null);
  const storyTimeline = useRef(null); // saving our current title transform animation
  const currentState = useRef(null); // saving our current pull animation
  const defaultPositionTest = (pos: number) => pos === 0;
  const pullDuration = 1;
  const titleDuration = 2;
  const duration = pullDuration + titleDuration; // needed for??
  const entriesRef = useRef<HTMLDivElement>(null);

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
      const titleTL = contextSafe(() => {
        const newTL = gsap.timeline({
          paused: true,
          ease: "power4.out",
          // making sure the animation state is preserved all the way so we can disable any click animation while its on
          onComplete: () => {
            isAnimating.current = false;
            setDelayedEntry(true); // Move this here instead
          },
          onReverseComplete: () => {
            isAnimating.current = false;
            storyTimeline.current = null;
          },
        });
        newTL.to(tainer.current, {
          top: "60%",
          duration: titleDuration,
          delay: animationTime,
        });
        newTL.to(
          title.current,
          {
            fontSize: "clamp(8vw, 6rem, 11vw)",
            color: "#F24150",
            delay: animationTime,
            duration: titleDuration,
          },
          "<"
        );
        return newTL;
      });

      //**//
      /* ONLY ONCE PER CYCLE */
      //**//

      const onStartBounce = contextSafe(() => {
        // basically i have to create this rigth after starting the current timeline, but outside of it so i doesnt happen when reversing
        const animation = gsap.to(title.current, {
          delay: 0.5,
          ease: "sine.in",
          keyframes: {
            scaleX: ["100%", "80%", "100%"],
            left: ["50%", "48%", "50%"],
            rotate: [0, -10, 0],
            easeEach: "none",
          },
        });
        return animation;
      });

      if (!storyTimeline.current) {
        storyTimeline.current = titleTL();
      }

      if (storyTimeline.current) {
        if (clicked) {
          storyTimeline.current.play();
          onStartBounce();
        }
        if (!clicked || currentWindow.every(defaultPositionTest)) {
          storyTimeline.current.reverse();
          storyTimeline.current = null;
        }
      }

      //**//
      /* ---- END ---- */
      //**//

      //**//
      /* Secondary Title Animation */
      //**//

      const onPullRight = contextSafe(() => {
        const minIn = gsap.to(tainer.current, {
          scale: 0.1,
          rotate: 30,
          left: "90%",
          top: "70%",
          duration: pullDuration,
          ease: "power4.in",
        });

        return minIn;
      });

      const onPullLeft = contextSafe(() => {
        const leftIn = gsap.to(tainer.current, {
          scale: 0.1,
          rotate: -30,
          left: "10%",
          top: "85%",
          duration: pullDuration,
          ease: "power4.out",
        });

        return leftIn;
      });

      if (currentWindow[0] === 1 && !currentState.current) {
        currentState.current = onPullLeft();
      }

      if (currentWindow[2] === 1 && !currentState.current) {
        currentState.current = onPullRight();
      }

      if (currentState.current && currentWindow.every(defaultPositionTest)) {
        currentState.current.reverse();
        setTimeout(() => {
          currentState.current = null;
        }, 501);
      }

      // Entry display
      // if (clicked && !isAnimating) {
      //   setTimeout(() => {
      //     setDelayedEntry(true);
      //     console.log("sucess", delayedEntry);
      //   }, 2);
      // }
      if (!clicked && !isAnimating) {
        setDelayedEntry(false);
        console.log("falsy", delayedEntry);
      }
    },
    {
      scope: tainer,
      dependencies: [clicked, currentWindow, isAnimating],
      revertOnUpdate: false,
    }
  );

  useEffect(() => {
    if (delayedEntry && entriesRef.current) {
      const items = entriesRef.current.querySelectorAll("div");

      gsap.from(items, {
        opacity: 0,
        y: 20,
        stagger: 0.3,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [delayedEntry]);

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
          }
        }}
        ref={title}
      >
        Story
      </ChapterTitle>
      <div className="contentWrapper">
        {clicked ? (
          <Intro style={oswald300.style}>
            ”Lets say it seems <em style={oswald500.style}>complicated</em>, but
            in the <em style={oswald500.style}>end</em> it all makes sense”
          </Intro>
        ) : null}
        {delayedEntry ? (
          <EntryList ref={entriesRef}>
            {entryData.map((entry, i) => Entry(entry[0], entry[1], i))}
          </EntryList>
        ) : null}
      </div>
    </ChapterContainer>
  );
}
