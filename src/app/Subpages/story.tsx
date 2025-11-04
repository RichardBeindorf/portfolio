"use client";

import styled from "styled-components";
import { permanentMarker, oswald300, oswald500 } from "../../styles/font";
import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { entryData } from "@/data/storyEntries";
import { DrawSVGPlugin, Flip } from "gsap/all";
import { TitleProps } from "../lowerHalf";
import { InnerContainer } from "./passion";

export default function Story({
  pullDirection,
  pulldirectionProp,
  currentWindow,
  delayTime,
  isAnimating,
}: TitleProps) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [showEntries, setShowEntries] = useState(false);
  gsap.registerPlugin(DrawSVGPlugin, Flip);
  const title = useRef(null);
  const tainer = useRef(null);
  const color = useRef("unset");
  const underline = useRef(null);
  const isInitial = useRef(true);
  const titleWrapper = useRef(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null); // To store the entry stagger animation
  const storyRight = useRef(null);
  const storyLeft = useRef(null);
  const innerRef = useRef(null);
  const setLeftDistance = useRef("80%");

  const pullDuration = 1;

  // useLayoutEffect used too avoid the colliding of Flip and React re-rendering, which can lead to Flip getting completed instantly
  useLayoutEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      isAnimating.current = false;
      return;
    }

    // first create (or get the existing) batch by id
    const batch = Flip.batch("story");
    const action = batch.add({
      getState() {
        return Flip.getState(tainer.current);
      },
      setState() {
        if (clicked) {
          tainer.current.style.setProperty("position", "relative");
          gsap.set(tainer.current, {
            left: "10%",
            top: "25%",
          });
        }
        if (!clicked) {
          tainer.current.style.setProperty("position", "absolute");

          gsap.set(tainer.current, {
            left: setLeftDistance.current,
            top: "80%",
          });
        }
      },
      animate(self) {
        const tl = gsap.timeline();
        tl.add(
          Flip.from(self.state, {
            targets: tainer.current,
            duration: 2,
            ease: "power4.out",
            delay: delayTime,
            absolute: true,
            onComplete: () => {
              isAnimating.current = false;
              if (clicked) {
                setShowEntries(true);
              }
            },
            props: "left, top",
          }),
          0
        );

        // this is manages the container height while dodging a battle with the flip, so the rest of the viewport is not overshadowed by an empty box
        if (innerRef.current) {
          const targetHeight = clicked ? "auto" : title.current.clientHeight;

          tl.to(
            innerRef.current,
            {
              height: targetHeight,
              duration: 2,
              ease: "power4.out",
            },
            0
          );
        }

        if (clicked) {
          tl.add(
            gsap.to(title.current, {
              fontSize: "clamp(8vw, 6rem, 11vw)",
              keyframes: {
                color: ["#262626", "#F24150"],
              },
              duration: 2,
              delay: delayTime,
            }),
            0
          );
        }
        // clicked to close title but we are not done animating
        if (isAnimating.current && !clicked && currentWindow.current[1] === 1) {
          tl.add(
            gsap.to(title.current, {
              fontSize: "var(--header)",
              keyframes: {
                color: ["#F24150", "#262626"],
              },
              duration: 2,
            }),
            0
          );
        }
      },
      // since this .from will be called forward and backwards we need to close the entries on start, also making sure
      onStart() {
        if (!clicked) {
          setShowEntries(false);
          currentWindow.current = [0, 0, 0];
        }
        isAnimating.current = true;
      },
    });

    batch.run();

    return () => {
      action.kill();
    };
  }, [clicked]);

  const { contextSafe } = useGSAP(() => {
    //**//
    /* ONLY ONCE PER CYCLE (Bounce animation) */
    //**//
    const onStartBounce = contextSafe(() => {
      gsap.to(title.current, {
        delay: 0.7,
        ease: "sine.in",
        keyframes: {
          scaleX: ["100%", "80%", "100%"],
          rotate: [0, -10, 0],
          easeEach: "none",
        },
      });
    });

    if (currentWindow.current[1] === 1 && clicked) {
      onStartBounce();
    }

    if (clicked) {
      color.current = "#F2F1E9";
    } else {
      color.current = "transparent";
    }
  }, [clicked, currentWindow.current]);

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
        entryStaggerAnimation.current?.kill();

        entryStaggerAnimation.current = gsap.from(items, {
          opacity: 0,
          y: 20,
          stagger: 0.03,
          duration: 0.2,
          ease: "power2.out",
          paused: true,
          onReverseComplete: () => {
            entryStaggerAnimation.current = null;
          },
        });
      }

      if (entryStaggerAnimation.current) {
        if (showEntries) {
          entryStaggerAnimation.current.play();
        }
        if (!showEntries && isAnimating.current) {
          entryStaggerAnimation.current.reverse();
          // Animate the contentWrapper back up when entries are reversing out
          if (entriesRef.current) {
            shift = gsap.to(entriesRef.current, {
              y: -60,
              ease: "power2.out",
              duration: 0.4,
            });
            shift.play();
            shift.reverse();
          }
        }
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

      if (showEntries && !isAnimating.current && underline.current) {
        drawUnderline();
      } else {
        // still have to reverse the underline
      }
    },
    {
      scope: tainer,
      dependencies: [showEntries],
      revertOnUpdate: false,
    }
  );

  useGSAP(() => {
    if (window) {
      window.matchMedia("(orientation: portrait)").matches
        ? (setLeftDistance.current = "35%")
        : (setLeftDistance.current = "45%");
    }

    if (!storyLeft.current) {
      storyLeft.current = gsap
        .timeline({
          paused: true,
          id: "storyLeft",
        })
        .to(tainer.current, {
          scale: 0.1,
          opacity: 0,
          rotate: -30,
          left: "10%",
          top: "50%",
          duration: pullDuration,
          ease: "power4.out",
        });
    }

    if (!storyRight.current) {
      storyRight.current = gsap
        .timeline({
          paused: true,
          id: "storyRight",
        })
        .to(tainer.current, {
          scale: 0.1,
          rotate: 30,
          opacity: 0,
          left: "90%",
          top: "50%",
          duration: pullDuration,
          ease: "power4.in",
        });
    }

    switch (pullDirection) {
      case "right":
        storyRight.current.play();
        break;
      case "left":
        storyLeft.current.play();
        break;
      case "default":
        if (storyRight.current.progress() === 1) storyRight.current.reverse();
        if (storyLeft.current.progress() === 1) storyLeft.current.reverse();
    }
  }, [pullDirection]);

  return (
    <ChapterContainer $backgroundColor={color.current} ref={tainer}>
      <InnerContainer ref={innerRef}>
        <TitleWrapper ref={titleWrapper}>
          <ChapterTitle
            style={permanentMarker.style}
            onClick={() => {
              if (!isAnimating.current) {
                const next = !clicked;

                setClicked(next);
                if (pullDirection === "default") {
                  currentWindow.current = [0, 1, 0];
                  pulldirectionProp("mid");
                }
                if (pullDirection === "mid") {
                  pulldirectionProp("default");
                }

                isAnimating.current = true;
              }
            }}
            ref={title}
          >
            Story
          </ChapterTitle>
          {clicked && !isAnimating.current ? (
            <svg width="650" height="20" className="underline">
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
        {showEntries && (
          <StoryEntryWrapper className="contentWrapper" ref={entriesRef}>
            <Intro style={oswald300.style}>
              &#34;Lets say it seems{" "}
              <em style={oswald500.style}>complicated</em>, but in the{" "}
              <em style={oswald500.style}>end</em> it all makes sense&#34;
            </Intro>
            <EntryList>
              {entryData.map((entry, i) => (
                <EntryWrapper key={i}>
                  <Bullet>&#47;&#47;</Bullet>
                  <EntryText style={oswald300.style}>{entry[0]}</EntryText>
                  <Year style={permanentMarker.style}>{entry[1]}</Year>
                </EntryWrapper>
              ))}
            </EntryList>
          </StoryEntryWrapper>
        )}
      </InnerContainer>
    </ChapterContainer>
  );
}

const ChapterContainer = styled.section<{ $backgroundColor?: string }>`
  position: absolute;
  top: 80%;
  left: 45%;
  text-align: left;
  width: max-content;
  max-width: 80%;

  mix-blend-mode: screen;
  padding: 15px;
  border-radius: 15px;
  background-color: ${(props) => props.$backgroundColor};
  border: 0px solid black;
  border-radius: 25px;

  @media (orientation: portrait) {
    left: 35%;
  }
`;

export const ChapterTitle = styled.h1`
  position: relative;
  color: var(--foreground);
  mix-blend-mode: normal;
  font-size: var(--header);
  text-align: center;
  user-select: none;

  &:hover {
    cursor: pointer;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  margin-bottom: 5vh;
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
