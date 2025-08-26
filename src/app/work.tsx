"use client";

import styled from "styled-components";
import {
  ChapterContainer,
  ChapterTitle,
  EntryList,
  Intro,
  TitleProps,
} from "./story";
import { oswald300, permanentMarker } from "@/styles/font";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { EntryWrapper } from "./entry";

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
          fontSize: "clamp(8vw, 6rem, 11vw)",
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
      {clicked ? (
        <PassionEntryWrapper>
          <Intro style={permanentMarker.style}>What have i done ... ?</Intro>
          <TopicWrapper>
            <Topic style={permanentMarker.style}>Leapout</Topic>
            <Text style={oswald300.style}>
              This was my first major Milestone, a fully functional Activity
              App, with location planning, activity database, weather report and
              much more! check it out:
              <IFrame
                width="400"
                height="768"
                src="https://activities-app-kappa.vercel.app/"
              ></IFrame>
              <Highlights></Highlights>
            </Text>
          </TopicWrapper>
          <TopicWrapper>
            <Topic style={permanentMarker.style}>App-Hub</Topic>
            <Text>
              Here we go, i had the honor of creating the first customer related
              entry point for Buildlinx, the App-Hub connects all future
              customers with the Buildlinx universe and accumulates all necesary
              applications for the users and devs based on roles and rights.
              Design done by
            </Text>
          </TopicWrapper>
          <TopicWrapper>
            <Topic style={permanentMarker.style}>
              Building-Management System
            </Topic>
            <Text>
              My biggest project yet, as part of a mandatory software i fully
              autonomously designed the appearance and implemented it in this
              rather difficult to code environment. It includes the
              visualisation and navigation to all the propperties a customer has
              from a global level down to the tiniest room of a building floor.
              Sadly it cannto show any of the result because of a NDA.
            </Text>
          </TopicWrapper>
        </PassionEntryWrapper>
      ) : null}
    </PassionContainer>
  );
}

const Topic = styled.h3`
  font-size: 1rem;
  color: var(--textAccent);
`;
const Text = styled.p`
  font-size: 1rem;
  color: var(--foreground);
`;
const Highlights = styled.span`
  color: var(--textAccent);
`;

const IFrame = styled.iframe`
  transform: scale(0.5);
`;

const PassionContainer = styled(ChapterContainer)`
  top: 70%;
  left: 90%;
`;

const Title = styled(ChapterTitle)``;

const TopicWrapper = styled(EntryList)``;

const PassionEntryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0px;
  background-color: var(--background);
`;
