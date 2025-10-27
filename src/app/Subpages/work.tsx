"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styled from "styled-components";
import { DrawSVGPlugin, Flip } from "gsap/all";
import { useLayoutEffect, useRef, useState } from "react";
import { oswald300, permanentMarker } from "@/styles/font";
import { ChapterTitle, Intro, TitleWrapper } from "./story";
import { TitleProps } from "../lowerHalf";
import { InnerContainer } from "./passion";

export default function Work({
  pullDirection,
  pulldirectionProp,
  currentWindow,
  delayTime,
  isAnimating,
}: TitleProps) {
  const [clicked, setClicked] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  gsap.registerPlugin(DrawSVGPlugin, Flip);
  const tainer = useRef(null);
  const title = useRef(null);
  const isInitial = useRef(true);
  const innerRef = useRef(null);

  const workLeft = useRef(null);
  const workMid = useRef(null);

  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null);
  const entriesRef = useRef(null);
  const underline = useRef(null);
  const color = useRef("unset");

  const pullDuration = 1;

  const nextProject = () => setCurrentProject((p) => (p + 1) % projects.length);

  const prevProject = () =>
    setCurrentProject((p) => (p - 1 + projects.length) % projects.length);

  const projects = [
    {
      title: "Leapout",
      description:
        "This was my first major milestone, a fully functional Activity App with location planning, activity database, weather report and much more!",
      iframe: "https://activities-app-kappa.vercel.app/",
    },
    {
      title: "App-Hub",
      description:
        "I had the honor of creating the first customer-related entry point for Buildlinx. The App-Hub connects all customers with the Buildlinx universe and accumulates all necessary applications for users and devs based on roles and rights.",
      images: ["/AppHubOne.png", "/AppHubTwo.png"],
    },
    {
      title: "Building-Management System",
      description:
        "My biggest project yet, designed and implemented in a complex environment. It includes visualization and navigation across properties from a global level down to the smallest rooms of a building floor. All rooms show information about temperature, humidity and co2 levels. (NDA protected)",
    },
  ];

  // useLayoutEffect used too avoid the colliding of Flip and React re-rendering, which can lead to Flip getting completed instantly
  useLayoutEffect(() => {
    // Skip the first render
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    // first create (or get the existing) batch by id
    const batch = Flip.batch("work");
    const action = batch.add({
      getState() {
        return Flip.getState(tainer.current);
      },
      setState() {
        if (clicked) {
          tainer.current.style.setProperty("position", "relative");
          gsap.set(tainer.current, { left: "10%", top: "25%" });
        } else if (!clicked) {
          tainer.current.style.setProperty("position", "absolute");

          if (window.matchMedia("orientation: portrait").matches) {
            gsap.set(tainer.current, { left: "60%", top: "50%" });
          } else gsap.set(tainer.current, { left: "80%", top: "50%" });
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

        if (innerRef.current) {
          const targetHeight = clicked ? "auto" : title.current.clientHeight;

          tl.to(
            innerRef.current,
            {
              height: targetHeight,
              duration: 0.1,
              ease: "power4.out",
            },
            0
          );
        }

        if (clicked && currentWindow.current[2] === 1) {
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
        if (isAnimating.current && !clicked && currentWindow.current[2] === 1) {
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
        isAnimating.current = true;
        if (!clicked) {
          setShowEntries(false);
          currentWindow.current = [0, 0, 0];
        }
      },
    });

    batch.run();
    console.log(window.matchMedia("(orientation: portrait)").matches);

    return () => {
      action.kill();
    };
  }, [clicked]);

  // Logic for click events on other titles, only click related
  const { contextSafe } = useGSAP(
    () => {
      const onStartBounce = contextSafe(() => {
        return gsap.to(title.current, {
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

      if (currentWindow.current[2] === 1 && clicked) {
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

  // Logic for animating content of this title, only entries related
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
        //still have to reverse the underline
      }
    },
    {
      scope: tainer,
      dependencies: [showEntries],
      revertOnUpdate: false,
    }
  );

  useGSAP(() => {
    if (!workLeft.current) {
      workLeft.current = gsap
        .timeline({
          paused: true,
          id: "workLeft",
        })
        .to(tainer.current, {
          duration: pullDuration,
          top: "50%",
          ease: "power4.out",
          keyframes: {
            rotate: [0, 24, 13, 24, 0, 0, -15, 0],
            scale: [1, 1, 1, 1, 0.5, 0.2],
            left: ["80%", "79%", "78%", "75%", "10%"],
            opacity: [1, 1, 1, 1, 1, 1, 1, 0],
            easeEach: "none",
          },
        });
    }

    if (!workMid.current) {
      workMid.current = gsap
        .timeline({
          paused: true,
          id: "workMid",
        })
        .to(tainer.current, {
          duration: pullDuration,
          ease: "power4.in",
          keyframes: {
            // 8 different phases maximum currently
            // first is start position
            rotate: [0, 24, 13, 24, 0, 0, -15, 0],
            scale: [1, 1, 1, 1, 0.5, 0.2],
            top: ["50%", "50%", "80%", "80%"],
            left: ["80%", "79%", "78%", "65%", "50%"],
            opacity: [1, 1, 1, 1, 1, 1, 1, 0],
            easeEach: "none",
          },
        });
    }

    switch (pullDirection) {
      case "mid":
        workMid.current.play();
        break;
      case "left":
        workLeft.current.play();
        break;
      case "default":
        if (workMid.current.progress() === 1) workMid.current.reverse();
        if (workLeft.current.progress() === 1) workLeft.current.reverse();
    }
  }, [pullDirection]);

  return (
    <WorkContainer
      $backgroundColor={color.current}
      ref={tainer}
      data-flip-id="workTainer"
    >
      <InnerContainer ref={innerRef}>
        <TitleWrapper>
          <Title
            style={permanentMarker.style}
            ref={title}
            onClick={() => {
              if (!isAnimating.current) {
                const next = !clicked;

                setClicked(next);

                if (pullDirection === "default") {
                  currentWindow.current = [0, 0, 1];
                  pulldirectionProp("right");
                }
                if (pullDirection === "right") {
                  pulldirectionProp("default");
                }

                isAnimating.current = true;
              }
            }}
          >
            Work
          </Title>
          {showEntries && (
            <svg width="650" height="20">
              <path
                ref={underline}
                d="M 0 0 Q 20 20, 500 0"
                stroke="#262626"
                strokeWidth="2.5px"
                fill="transparent"
              />
            </svg>
          )}
        </TitleWrapper>

        {showEntries && (
          <WorkEntryWrapper ref={entriesRef}>
            <Intro style={permanentMarker.style}>What have I done ... ?</Intro>
            <TopicWrapper>
              <Topic style={permanentMarker.style}>
                {projects[currentProject].title}
              </Topic>
              <DetailWrapper>
                <Text style={oswald300.style}>
                  {projects[currentProject].description}
                </Text>
                {projects[currentProject].iframe && (
                  <IFrameWrapper>
                    <IFrame src={projects[currentProject].iframe} />
                  </IFrameWrapper>
                )}
                {/* Optional images */}
                {projects[currentProject].images && (
                  <ImageGallery>
                    {projects[currentProject].images.map((src, idx) => (
                      <PreviewImage
                        key={idx}
                        src={src}
                        alt={`${projects[currentProject].title} screenshot ${
                          idx + 1
                        }`}
                      />
                    ))}
                  </ImageGallery>
                )}
              </DetailWrapper>
            </TopicWrapper>

            <NavButtons>
              <button onClick={prevProject} style={permanentMarker.style}>
                ◀ Prev
              </button>
              <button onClick={nextProject} style={permanentMarker.style}>
                Next ▶
              </button>
            </NavButtons>
          </WorkEntryWrapper>
        )}
      </InnerContainer>
    </WorkContainer>
  );
}

const WorkContainer = styled.section<{ $backgroundColor: string }>`
  top: 50%;
  left: 80%;
  position: absolute;
  max-width: 90%;
  mix-blend-mode: normal;
  padding: 15px;
  background-color: ${(props) => props.$backgroundColor};
  border: 0px solid black;
  border-radius: 25px;

  @media (orientation: portrait) {
    left: 60%;
  }
`;

const WorkEntryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0px;
  background-color: var(--background);
`;

const TopicWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Topic = styled.h3`
  font-size: 2rem;
  color: var(--textAccent);
`;
const Text = styled.p`
  font-size: 1.25rem;
  color: var(--foreground);
  padding: 0;
  margin: 0;
`;

// Gotta find out a better way to adjust
const IFrameWrapper = styled.div`
  width: 280px; /* 400 * 0.7 */
  height: 476px; /* 768 * 0.7 */
  overflow: hidden;
  border-radius: 15px;
`;

const IFrame = styled.iframe`
  width: 400px;
  height: 680px;
  transform: scale(0.7);
  transform-origin: top left;
  border: none;
`;

const Title = styled(ChapterTitle)`
  text-align: left;
`;

// const Highlights = styled.span`
//   color: var(--textAccent);
// `;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  button {
    background: var(--background);
    color: var(--foreground);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: color 0.2s ease;

    &:hover {
      color: var(--textAccent);
    }
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.7rem;
  margin-top: 1rem;
`;

const PreviewImage = styled.img`
  width: 35vw;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  object-fit: cover;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;
