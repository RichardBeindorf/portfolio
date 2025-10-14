"use client";

import styled from "styled-components";
import { ChapterTitle, TitleWrapper } from "./story";
import { oswald300, oswald500, permanentMarker } from "@/styles/font";
import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin, Flip } from "gsap/all";
import { TitleProps } from "../lowerHalf";

export default function Passion({
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
  const entriesRef = useRef<HTMLDivElement>(null);
  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null); // To store the entry stagger animation
  const initialOrDefaultWindow = useRef(true);

  const initialPosition: boolean = currentWindow.current === "initial";
  let defaultPosition: boolean;
  if (typeof currentWindow.current !== "string") {
    const tester = (pos: number) => pos === 0;
    defaultPosition = currentWindow.current.every(tester);
  }

  if (!initialPosition) {
    initialOrDefaultWindow.current = defaultPosition ? true : false;
  } else {
    initialOrDefaultWindow.current = true;
  }
  const pullDuration = 1;

  // useLayoutEffect used too avoid the colliding of Flip and React re-rendering, which can lead to Flip getting completed instantly
  useLayoutEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    // first create (or get the existing) batch by id
    let batch = Flip.batch("passion");
    let action = batch.add({
      getState() {
        return Flip.getState(tainer.current);
      },
      setState() {
        if (clicked) {
          tainer.current.style.setProperty("position", "relative");
          gsap.set(tainer.current, { left: "10%", top: "25%" });
        } else {
          tainer.current.style.setProperty("position", "absolute");
          gsap.set(tainer.current, { left: "10%", top: "50%" });
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
        if (isAnimating.current && !clicked && currentWindow.current[0] === 1) {
          tl.add(
            gsap.to(title.current, {
              fontSize: "clamp(2vw, 3rem, 4.5vw)",
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

  const { contextSafe } = useGSAP(
    () => {
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

      //**//
      /* Secondary Title Animation (Pull Left/Right) */
      //**//

      const onPullMid = contextSafe(() => {
        return gsap.to(tainer.current, {
          scale: 0.1,
          opacity: 0,
          rotate: -30,
          left: "50%",
          top: "85%",
          duration: pullDuration,
          ease: "power4.out",
        });
      });

      const onPullRight = contextSafe(() => {
        return gsap.to(tainer.current, {
          scale: 0.1,
          rotate: 30,
          opacity: 0,
          left: "90%",
          top: "70%",
          duration: pullDuration,
          ease: "power4.in",
        });
      });

      const onDefault = contextSafe(() => {
        return gsap.to(tainer.current, {
          display: "block",
          duration: delayTime + 1,
          ease: "power4.out",
          top: "50%",
          left: "10%",
          scale: 1,
          opacity: 1,
          rotate: 0,
        });
      });

      if (currentWindow.current[1] === 1 && !clicked) {
        onPullMid();
      } else if (currentWindow.current[2] === 1) {
        onPullRight();
      } else if (defaultPosition && !isInitial.current && !clicked) {
        onDefault();
      }
      if (currentWindow.current[0] === 1 && clicked) {
        onStartBounce();
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
        color.current = "#F2F1E9";
        drawUnderline();
      } else {
        color.current = "unset";
      }
    },
    {
      scope: tainer,
      dependencies: [showEntries],
      revertOnUpdate: false,
    }
  );

  return (
    <PassionContainer $backgroundColor={color.current} ref={tainer}>
      <TitleWrapper>
        <Title
          style={permanentMarker.style}
          onClick={() => {
            if (
              !isAnimating.current &&
              currentWindow.current[1] !== 1 &&
              currentWindow.current[2] !== 1
            ) {
              const next = !clicked;

              setClicked(next);
              if (initialOrDefaultWindow.current) {
                currentWindow.current = [1, 0, 0];
              }

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
        {showEntries && (
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
        )}
      </PassionContent>
    </PassionContainer>
  );
}

const PassionContainer = styled.section<{ $backgroundColor: string }>`
  position: absolute;
  top: 55%;
  left: 10%;
  text-align: left;
  max-width: 90%;
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
