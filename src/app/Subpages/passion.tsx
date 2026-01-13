"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styled from "styled-components";
import { TitleWrapper } from "./story";
import { TitleConfig } from "../lowerHalf";
import { DrawSVGPlugin, Flip } from "gsap/all";
import { useLayoutEffect, useRef, useState } from "react";
import { oswald300, oswald500, permanentMarker } from "@/styles/font";

export default function Passion({ config }: TitleConfig) {
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

  const passionRight = useRef(null);
  const passionMid = useRef(null);

  const pullDuration = 1.5;
  const underlineWidth = 650 * Math.min(resizeDelta * 1.5, 1);
  const strokeWidth = 2.5 * Math.min(resizeDelta * 1.5, 1);

  function handleClick() {
    if (!isAnimating.current) {
      const next = !clicked;
      setClicked(next);
      if (pullDirection === "default") {
        pullDirectionProp("left");
      }
      if (pullDirection === "left") {
        spacerHeight(0);
        pullDirectionProp("default");
      }
      isAnimating.current = true;
    }
  }

  // useLayoutEffect used too avoid the colliding of Flip and React re-rendering, which can lead to Flip getting completed instantly
  useLayoutEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    // first create (or get the existing) batch by id
    const batch = Flip.batch("passion");
    const action = batch.add({
      getState() {
        return Flip.getState(tainer.current);
      },
      setState() {
        if (clicked) {
          tainer.current.style.position = "relative";
          tainer.current.style.left = "10%";
          tainer.current.style.top = "15%";
        } else {
          tainer.current.style.position = "absolute";
          tainer.current.style.left = positionsObj.passion;
          tainer.current.style.top = "45%";
        }
      },
      animate(self) {
        const tl = gsap.timeline({ ease: "power1.in" });
        tl.add(
          Flip.from(self.state, {
            targets: tainer.current,
            duration: 1,
            ease: "power1.in",
            delay: delayTime - 0.5,
            absolute: true,
            onComplete: () => {
              isAnimating.current = false;
              if (clicked) {
                setShowEntries(true);
              }
            },
          }),
          0
        );

        if (clicked) {
          // Bounce when other titles crash in
          tl.add(
            gsap.to(title.current, {
              duration: 0.35,
              delay: 0.65,
              ease: "sine.in",
              transformOrigin: "left center",
              keyframes: {
                scaleX: [1.0, 0.6, 1.0],
                skewY: [0, -10, 0],
                easeEach: "none",
              },
            }),
            0
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
            0
          );
        }
        // clicked to close title but we are not done animating
        if (!clicked) {
          tl.add(
            gsap.to(title.current, {
              scale: 1,
              keyframes: {
                color: ["#F24150", "#262626"],
              },
              duration: 1,
            }),
            0
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

  //**//
  /* Staggered Animation of the Entries - Managed outside main GSAP context for clarity */
  //**//
  const { contextSafe } = useGSAP(
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
      }
    },
    {
      scope: tainer,
      dependencies: [showEntries],
      revertOnUpdate: false,
    }
  );

  // Pull Animations: Defining Timelines
  useGSAP(() => {
    let yAnimationValue = window.innerHeight * 0.35;
    let xRightValue = window.innerWidth * 0.65;
    let xMidValue = window.innerWidth * 0.3;

    const sharedKeyframes = {
      // 8 different phases maximum currently
      // first is start position
      rotate: [0, 13, 20, 0, 0, -15, 0],
      scale: [1, 1, 0.5, 0.2, 0.1],
      opacity: [1, 1, 1, 1, 0.5, 0, 0, 0],
      easeEach: "none",
    };

    passionRight.current = gsap
      .timeline({
        paused: true,
        id: "passionRight",
      })
      .to(tainer.current, {
        duration: pullDuration,
        ease: "power1.in",
        keyframes: {
          ...sharedKeyframes,
          x: [0, 0, xRightValue, xRightValue],
        },
      });

    passionMid.current = gsap
      .timeline({
        paused: true,
        id: "passionMid",
      })
      .to(tainer.current, {
        duration: pullDuration,
        delay: 0.85,
        ease: "power3.out",
        keyframes: {
          // 8 different phases maximum currently
          // first is start position
          ...sharedKeyframes,
          y: [0, 0, yAnimationValue, yAnimationValue],
          x: [0, 0, xMidValue, xMidValue],
        },
      });
  }, []);

  // Pull Animations: Controll Logic
  useGSAP(() => {
    if (!passionRight.current || !passionMid.current) return;

    switch (pullDirection) {
      case "mid":
        passionMid.current.play();
        break;
      case "right":
        passionRight.current.play();
        break;
      case "default":
        if (passionMid.current.progress() === 1) passionMid.current.reverse();
        if (passionRight.current.progress() === 1)
          passionRight.current.reverse();
        if (clicked) setClicked(false); // User clicks outside the title box to leave the screen
    }
  }, [pullDirection]);

  return (
    <PassionContainer ref={tainer} $position={positionsObj.passion}>
      <TitleWrapper>
        <Title style={permanentMarker.style} onClick={handleClick} ref={title}>
          Passion
        </Title>
        {clicked && !isAnimating.current ? (
          <svg width={underlineWidth} height="20">
            <path
              ref={underline}
              d="M 0 0 Q 20 20, 500 0"
              stroke="#262626"
              strokeWidth={`${strokeWidth}px`}
              fill="transparent"
            />
          </svg>
        ) : null}
      </TitleWrapper>

      <PassionContent className="contentWrapper">
        {showEntries && (
          <PassionEntryWrapper ref={entriesRef}>
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
                if it didn&#39;t scare me it probably didn&#39;t improve my life
              </Text>
            </TopicWrapper>
          </PassionEntryWrapper>
        )}
      </PassionContent>
    </PassionContainer>
  );
}

const PassionContainer = styled.section<{ $position: string }>`
  position: absolute;
  top: 45%;
  left: ${(props) => props.$position || "15%"};
  width: max-content;
  max-width: 80vw;

  pointer-events: auto;
  -webkit-tap-highlight-color: transparent; // stop the background highlight in safar browser when clicked/tapped
  will-change: transform;
`;

export const InnerContainer = styled.div`
  position: relative;
  height: auto;
  will-change: height;
`;

const Title = styled.h1`
  text-align: left;
  position: relative;
  color: var(--foreground);
  mix-blend-mode: normal;
  font-size: var(--header);

  user-select: none;

  &:hover {
    cursor: pointer;
  }
`;

const PassionEntryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0px;
  background-color: var(--background);
`;

const PassionContent = styled.div``;

const TopicWrapper = styled.div`
  margin-top: 25px;
`;

const Subtitle = styled.div`
  width: max-content;
  max-width: 95vw;
  font-size: var(--subTitle);
  color: var(--foreground);
`;

const Topic = styled.h3`
  font-size: var(--subTitle);
  color: var(--textAccent);
`;

const Text = styled.p`
  font-size: var(--inlineText);
  color: var(--foreground);
`;

const Highlights = styled.span`
  color: var(--textAccent);
`;
