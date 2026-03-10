"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styled from "styled-components";
import { TitleConfig } from "../lowerHalf";
import { DrawSVGPlugin, Flip } from "gsap/all";
import { entryData } from "@/data/storyEntries";
import { useLayoutEffect, useRef, useState } from "react";
import { permanentMarker, oswald300, oswald500 } from "../../styles/font";
import handlePopStateChange from "@/util/popStateHandler";

export default function Story({ config }: TitleConfig) {
  const {
    pullDirection,
    pullDirectionProp,
    delayTime,
    isAnimating,
    resizeDelta,
    positionsObj,
    spacerHeight,
  } = config;
  const [clicked, setClicked] = useState<boolean>(false);
  const [showEntries, setShowEntries] = useState(false);
  gsap.registerPlugin(DrawSVGPlugin, Flip);
  const title = useRef(null);
  const tainer = useRef(null);
  const underline = useRef(null);
  const isInitial = useRef(true);
  const entriesRef = useRef<HTMLDivElement>(null);
  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null); // To store the entry stagger animation
  const storyRight = useRef(null);
  const storyLeft = useRef(null);

  const pullDuration = 1;
  const underlineWidth = 650 * Math.min(resizeDelta * 1.5, 1);
  const strokeWidth = 2.5 * Math.min(resizeDelta * 1.5, 1);

  function handleClick() {
    if (!isAnimating.current) {
      const next = !clicked;
      setClicked(next);
      if (pullDirection === "default") {
        pullDirectionProp("mid");
        window.history.pushState({ name: "mid" }, "pushing mid", "#mid");
      }
      if (pullDirection === "mid") {
        spacerHeight(0);
        pullDirectionProp("default");
      }
      isAnimating.current = true;
    }
  }

  // // Using this to give the Title more space so it doesnt cut of on smaller screens
  // useLayoutEffect(() => {
  //   if (tainer.current) {
  //     const minWidthTitle = tainer.current.clientWidth;
  //     tainer.current.style.minWidth = minWidthTitle + 10 + "px";
  //   }
  // }, []);

  // useLayoutEffect used too avoid the colliding of Flip and React re-rendering, which can lead to Flip getting completed instantly
  useLayoutEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      isAnimating.current = false;
      return;
    }

    if (clicked) {
      // Everytime a title got clicked i want to listen to the browser wanting to got back in history
      window.addEventListener("popstate", (event) => {
        handlePopStateChange(
          event,
          pullDirectionProp,
          clicked,
          setClicked,
          pullDirection,
        );
      });
    } else {
      window.removeEventListener("popstate", (event) => {
        handlePopStateChange(
          event,
          pullDirectionProp,
          clicked,
          setClicked,
          pullDirection,
        );
      });
    }

    // first create (or get the existing) batch by id
    const batch = Flip.batch("story");
    const action = batch.add({
      getState() {
        return Flip.getState(tainer.current);
      },

      // Here we capture the intended final position and tell Flip where we want to animate to
      setState() {
        if (clicked) {
          tainer.current.style.position = "relative";
          tainer.current.style.left = "10%";
          tainer.current.style.top = "15%";
        } else {
          tainer.current.style.position = "absolute";
          tainer.current.style.left = positionsObj.story;
          tainer.current.style.top = "80%";
        }
      },

      // triggering the Flip and adding some additional animations
      animate(self) {
        const tl = gsap.timeline({ ease: "power1.in" });
        tl.add(
          Flip.from(self.state, {
            targets: tainer.current,
            duration: 1,
            ease: "power1.in",
            delay: delayTime + 0.1,
            absolute: true,
            onComplete: () => {
              isAnimating.current = false;
              if (clicked) {
                setShowEntries(true);
              }
            },
          }),
          0,
        );

        // First Bounce = Work crashing into Story
        if (clicked) {
          tl.add(
            gsap.to(title.current, {
              duration: 0.35,
              delay: 0.85,
              ease: "sine.in",
              transformOrigin: "left center",
              keyframes: {
                scaleX: [1.0, 0.9, 1.0],
                skewY: [0, -10, 0],
                easeEach: "none",
              },
            }),
            0,
          );

          // Second Bounce = Passion crashing into Story
          tl.add(
            gsap.to(title.current, {
              duration: 0.2,
              delay: 1.22,
              ease: "sine.in",
              transformOrigin: "right center",
              keyframes: {
                scaleX: [1.0, 0.9, 1.0],
                skewY: [0, -10, 0],
                easeEach: "none",
              },
            }),
            0,
          );

          tl.add(
            gsap.to(title.current, {
              duration: 1,
              delay: delayTime,
              scaleX: 2.25,
              scaleY: 2.25,
              transformOrigin: "left bottom",
              keyframes: {
                color: ["#262626", "#F24150"],
              },
            }),
            0,
          );
        }

        // clicked to close title but we are not done animating
        if (!clicked) {
          tl.add(
            gsap.to(title.current, {
              duration: 1,
              delay: 0.5,
              scale: 1,
              keyframes: {
                color: ["#F24150", "#262626"],
              },
            }),
            0,
          );
        }
      },
      // since this .from will be called forward and backwards we need to close the entries on start, also making sure
      onStart() {
        if (!clicked) {
          setShowEntries(false);
        }
        isAnimating.current = true;
      },
    });

    batch.run();

    return () => {
      action.kill();
    };
  }, [clicked]);

  /**/
  /* Staggered Animation of the Entries - Managed outside main GSAP context for clarity */
  /**/
  const { contextSafe } = useGSAP(
    () => {
      const items = entriesRef.current
        ? entriesRef.current.querySelectorAll("div")
        : [];
      let shift;

      // Initializing the stagger
      if (!entryStaggerAnimation.current && items.length > 0) {
        entryStaggerAnimation.current?.kill();

        entryStaggerAnimation.current = gsap.from(items, {
          opacity: 0,
          y: 20,
          stagger: 0.03,
          duration: 0.2,
          ease: "power2.out",
          paused: true,
          onComplete: () => {
            spacerHeight(tainer.current.getBoundingClientRect().height);
          },
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

      /**/
      /* Underline Animation */
      /**/

      const drawUnderline = contextSafe(() => {
        gsap.from(underline.current, {
          drawSVG: "0",
          ease: "power1.in",
          delay: 0,
          duration: 0.65,
        });
      });

      if (showEntries && !isAnimating.current && underline.current) {
        drawUnderline();
      }
      // still have to reverse the underline
    },
    {
      scope: tainer,
      dependencies: [showEntries],
      revertOnUpdate: false,
    },
  );

  // Pull Animations: Defining Timelines
  useGSAP(() => {
    let yAnimationValue = -window.innerHeight * 0.35;
    let xLeftValue = -window.innerWidth * 0.3;
    let xRightValue = window.innerWidth * 0.3;

    const sharedKeyframes = {
      // 8 different phases maximum currently
      // first is start position
      rotate: [0, 24, 13, 24, 0, 0, -15, 0],
      y: [0, 0, yAnimationValue, yAnimationValue],
      scale: [1, 1, 0.5, 0.2, 0.1],
      opacity: [1, 1, 1, 1, 0.5, 0, 0, 0],
      easeEach: "none",
    };

    storyLeft.current = gsap
      .timeline({
        paused: true,
        id: "storyLeft",
      })
      .to(tainer.current, {
        duration: pullDuration,
        ease: "power1.in",
        keyframes: {
          ...sharedKeyframes,
          x: [0, 0, xLeftValue, xLeftValue],
        },
      });

    storyRight.current = gsap
      .timeline({
        paused: true,
        id: "storyRight",
      })
      .to(tainer.current, {
        duration: pullDuration,
        ease: "power1.in",
        keyframes: {
          ...sharedKeyframes,
          x: [0, 0, xRightValue, xRightValue],
        },
      });
  }, []);

  // Pull Animations: Controll Logic
  useGSAP(() => {
    if (!storyLeft.current || !storyRight.current) return;

    console.log("STORY PULL DIRECTION CHANGE  ");

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
        if (clicked) setClicked(false); // User clicks outside the title box to leave the screen
    }
  }, [pullDirection]);

  return (
    <ChapterContainer ref={tainer} $position={positionsObj.story}>
      <TitleWrapper>
        <ChapterTitle
          style={permanentMarker.style}
          onClick={handleClick}
          ref={title}
        >
          Story
        </ChapterTitle>

        {clicked && !isAnimating.current && (
          <svg width={underlineWidth} height="20" className="underline">
            <path
              ref={underline}
              d="M 0 0 Q 20 20, 500 0"
              stroke="#262626"
              strokeWidth={`${strokeWidth}px`}
              fill="transparent"
            />
          </svg>
        )}
      </TitleWrapper>

      {showEntries && (
        <StoryEntryWrapper className="contentWrapper" ref={entriesRef}>
          <Intro style={oswald300.style}>
            "Lets say it seems <em style={oswald500.style}>complicated</em>, but
            in the <em style={oswald500.style}>end</em> it all makes sense"
          </Intro>
          <EntryList>
            {entryData.map((entry, i) => (
              <EntryWrapper key={i}>
                <Bullet>//</Bullet>
                <EntryText style={oswald300.style}>{entry[0]}</EntryText>
                <Year
                  style={
                    entry[1] === "now"
                      ? {
                          ...permanentMarker.style,
                          color: "var(--textAccent)",
                        }
                      : permanentMarker.style
                  }
                >
                  {entry[1]}
                </Year>
              </EntryWrapper>
            ))}
          </EntryList>
        </StoryEntryWrapper>
      )}
    </ChapterContainer>
  );
}

const ChapterContainer = styled.section<{ $position: string }>`
  position: absolute;
  top: 80%;
  left: ${(props) => props.$position || "45%"};

  width: max-content;
  max-width: 80vw;

  pointer-events: auto;
  -webkit-tap-highlight-color: transparent; // stop the background highlight in safar browser when clicked/tapped
  will-change: transform;
`;

export const ChapterTitle = styled.h1`
  position: relative;
  color: var(--foreground);

  font-size: var(--header);
  text-align: center;
  user-select: none;

  padding-right: 10px; // needed for mobile screens so the Y does not get cut off
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
  font-size: var(--subTitle);
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
  transition:
    padding 1s ease-in,
    background-color 1s ease-in,
    font-size 1s ease-in;

  &:hover {
    padding: 5px;
    background-color: rgba(242, 241, 233, 1);
    font-size: clamp(1vw, 1.1rem, 2vw);
    transition:
      padding 0.5s ease-out,
      background-color 0.5s ease-out,
      font-size 0.5s ease-out;
  }
`;

const Bullet = styled.span`
  color: var(--textAccent);
  font-size: 2rem;
`;

const EntryText = styled.p`
  /* width: max-content; */
  font-size: var(--inlineText);
`;

const Year = styled.span`
  font-size: var(--inlineText);
`;
