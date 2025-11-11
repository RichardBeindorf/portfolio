"use client";

import styled from "styled-components";
import { TitleWrapper } from "./story";
import { oswald300, oswald500, permanentMarker } from "@/styles/font";
import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin, Flip } from "gsap/all";
import { TitleProps } from "../lowerHalf";

export default function Passion({
  pullDirection,
  pulldirectionProp,
  currentWindow,
  delayTime,
  isAnimating,
  resizeDelta,
  positionsObj,
}: TitleProps) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [showEntries, setShowEntries] = useState(false);
  gsap.registerPlugin(DrawSVGPlugin, Flip);
  const title = useRef(null);
  const tainer = useRef(null);
  const color = useRef("unset");
  const underline = useRef(null);
  const isInitial = useRef(true);
  const entriesRef = useRef<HTMLDivElement>(null);
  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null); // To store the entry stagger animation
  const innerRef = useRef(null);

  const passionRight = useRef(null);
  const passionMid = useRef(null);

  const pullDuration = 1;
  const underlineWidth = resizeDelta < 1 ? 650 * resizeDelta : 650;
  const strokeWidth = resizeDelta < 1 ? 2.5 * resizeDelta * 2 : 2.5;

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
          tainer.current.style.setProperty("position", "relative");
          gsap.set(tainer.current, { left: "10%", top: "25%", width: "80%" });
        }
        if (!clicked) {
          tainer.current.style.setProperty("position", "absolute");

          gsap.set(tainer.current, {
            left: positionsObj.passion,
            top: "50%",
            width: "auto",
          });
        }
      },
      animate(self) {
        const tl = gsap.timeline({ ease: "power1.in" });
        tl.add(
          Flip.from(self.state, {
            targets: tainer.current,
            duration: 1,
            ease: "power1.in",
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
              duration: 1,
              ease: "power1.in",
            },
            0
          );
        }

        if (clicked) {
          tl.add(
            gsap.to(title.current, {
              keyframes: {
                color: ["#262626", "#F24150"],
                fontSize: ["clamp(2vw, 3rem, 8.5vw)", "clamp(8vw, 6rem, 11vw)"],
              },
              duration: 1,
              delay: delayTime,
            }),
            0
          );
        }
        // clicked to close title but we are not done animating
        if (isAnimating.current && !clicked && currentWindow.current[0] === 1) {
          tl.add(
            gsap.to(title.current, {
              keyframes: {
                color: ["#F24150", "#262626"],
                fontSize: ["clamp(8vw, 6rem, 11vw)", "clamp(2vw, 3rem, 8.5vw)"],
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

  const { contextSafe } = useGSAP(
    () => {
      //**//
      /* ONLY ONCE PER CYCLE (Bounce animation) */
      //**//
      const onStartBounce = contextSafe(() => {
        gsap.to(title.current, {
          delay: 0.7,
          ease: "sine.in",
          keyframes: {
            scaleX: ["100%", "80%", "100%"],
            // left: ["50%", "48%", "50%"],
            rotate: [0, -10, 0],
            easeEach: "none",
          },
        });
      });
      if (currentWindow.current[0] === 1 && clicked) {
        onStartBounce();
      }

      if (clicked) {
        color.current = "#F2F1E9";
      } else {
        color.current = "transparent";
      }
    },
    {
      scope: tainer,
      dependencies: [clicked],
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
    if (!passionMid.current) {
      passionMid.current = gsap
        .timeline({
          paused: true,
          id: "passionMid",
        })
        .to(tainer.current, {
          duration: pullDuration,
          rotate: 30,
          ease: "power1.in",
          keyframes: {
            // 8 different phases maximum currently
            // first is start position
            // rotate: [0, 24, 13, 24, 0, 0, -15, 0],
            scale: [1, 1, 1, 1, 0.5, 0.2],
            top: ["50%", "50%", "80%", "80%"],
            left: [positionsObj.passion, positionsObj.story],
            opacity: [1, 1, 1, 1, 1, 1, 1, 0],
            easeEach: "none",
          },
        });
    }

    if (!passionRight.current) {
      passionRight.current = gsap
        .timeline({
          paused: true,
          id: "passionRight",
        })
        .to(tainer.current, {
          duration: pullDuration,
          top: "50%",
          rotate: 30,
          ease: "power1.in",
          keyframes: {
            scale: [1, 1, 1, 1, 0.5, 0.2],
            // rotate: [0, 24, 13, 24, 0, 0, -15, 0],
            left: [positionsObj.passion, positionsObj.work],
            opacity: [1, 1, 1, 1, 1, 1, 1, 0],
            easeEach: "none",
          },
        });
    }

    console.log(positionsObj);

    switch (pullDirection) {
      case "mid":
        passionMid.current.play();
        break;
      case "right":
        passionRight.current.play();
        break;
      case "default":
        if (passionMid.current.progress() === 1) {
          passionMid.current.reverse();
        }
        if (passionRight.current.progress() === 1) {
          passionRight.current.reverse();
        }
    }
  }, [pullDirection]);

  return (
    <PassionContainer $backgroundColor={color.current} ref={tainer}>
      {/* This InnerContainer is manages the container height while dodging a battle with the flip, so the rest of the viewport is not overshadowed by an empty box when entries are closing*/}
      <InnerContainer ref={innerRef}>
        <TitleWrapper>
          <Title
            style={permanentMarker.style}
            onClick={() => {
              if (!isAnimating.current) {
                const next = !clicked;
                setClicked(next);
                if (pullDirection === "default") {
                  currentWindow.current = [1, 0, 0];
                  pulldirectionProp("left");
                }
                if (pullDirection === "left") {
                  pulldirectionProp("default");
                }
                isAnimating.current = true;
              }
            }}
            ref={title}
          >
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
                  trying to keep my perfectionism in the bottle and funneling
                  the energy instead into{" "}
                  <Highlights style={oswald500.style}>
                    training skills
                  </Highlights>{" "}
                  rather than micro optimizations is pushing me - in sports,
                  relationships and work
                </Text>
              </TopicWrapper>
              <TopicWrapper style={{ textAlign: "right" }}>
                <Topic style={permanentMarker.style}>Discovery</Topic>
                <Text style={oswald300.style}>
                  getting out of my{" "}
                  <Highlights style={oswald500.style}>comfort areas</Highlights>{" "}
                  - if it didn&#39;t scare me it probably didn&#39;t improve my
                  life
                </Text>
              </TopicWrapper>
            </PassionEntryWrapper>
          )}
        </PassionContent>
      </InnerContainer>
    </PassionContainer>
  );
}

const PassionContainer = styled.section<{ $backgroundColor: string }>`
  position: absolute;
  top: 50%;
  left: 6%;
  text-align: left;
  max-width: 1100px;
  mix-blend-mode: screen;

  padding: 15px;
  border-radius: 15px;
  background-color: ${(props) => props.$backgroundColor};
  border: 0px solid black;
  border-radius: 25px;
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
  /* align-items: start; */
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
