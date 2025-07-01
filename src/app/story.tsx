"use client";

import styled from "styled-components";
import {
  permanentMarker,
  oswald300,
  oswald400,
  oswald500,
} from "../styles/font";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export type CurrentWindow = {
  currentWindow: number[];
  setCurrentWindow: Dispatch<SetStateAction<number[]>>;
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

function Entry(body, year, id, hover) {
  return (
    <div key={id}>
      {hover ? (
        <EntryWrapper>
          <Bullet>//</Bullet>
          <EntryText style={oswald300.style}>{body}</EntryText>
          <Year style={permanentMarker.style}>{year}</Year>
        </EntryWrapper>
      ) : null}
    </div>
  );
}

export default function Story({
  currentWindow,
  setCurrentWindow,
}: CurrentWindow) {
  const [clicked, setClicked] = useState<boolean>(false);
  const title = useRef(null);
  const tainer = useRef(null);
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
      // const masterTl = gsap.timeline()

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
        gsap.to(tainer.current, {
          top: "85%",
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

      clicked ? onClickIn() : onClickOut();
    },
    {
      scope: tainer,
      dependencies: [clicked, currentWindow],
      revertOnUpdate: false,
    }
  );

  return (
    <ChapterContainer ref={tainer}>
      <ChapterTitle
        style={permanentMarker.style}
        onClick={() => {
          const next = !clicked;
          setClicked(next);
          setCurrentWindow(next ? [0, 1, 0] : [0, 0, 0]);
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
        <EntryList>
          {entryData.map((entry, i) => {
            return Entry(entry[0], entry[1], i, clicked);
          })}
        </EntryList>
      </div>
    </ChapterContainer>
  );
}
