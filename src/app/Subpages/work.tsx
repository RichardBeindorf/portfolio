"use client";

import styled from "styled-components";
import { ChapterTitle, Intro, TitleProps, TitleWrapper } from "./story";
import { oswald300, permanentMarker } from "@/styles/font";
import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin, Flip } from "gsap/all";

export default function Work({
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

  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null);
  const entriesRef = useRef(null);
  const underline = useRef(null);
  const color = useRef("unset");
  const defaultPositionTest = (pos: number) => pos === 0;

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
    // first create (or get the existing) batch by id
    let batch = Flip.batch("id");
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
          gsap.set(tainer.current, { left: "80%", top: "50%" });
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
              if (clicked) {
                isAnimating.current = false;
                setShowEntries(true);
              } else {
                isAnimating.current = false;
                currentWindow.current = [0, 0, 0];
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
        if (isAnimating.current && !clicked) {
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
        }
        isAnimating.current = true;
      },
    });

    batch.run();

    return () => {
      action.kill();
    };
  }, [clicked]);

  // Logic for click events on other titles, only click related
  const { contextSafe } = useGSAP(
    () => {
      // trigger pulls when other titles get clicked
      const onPullMid = contextSafe(() => {
        return gsap.to(tainer.current, {
          id: "midIn",
          duration: delayTime + 1,
          ease: "power4.out",
          keyframes: {
            // 8 different phases maximum currently
            // first is start position
            rotate: [0, 24, 13, 24, 0, 0, -15, 0],
            scale: [1, 1, 1, 1, 0.5, 0.2],
            top: ["70%", "70%", "85%", "85%"],
            left: ["90%", "89%", "88%", "75%", "50%"],
            opacity: [1, 1, 1, 1, 1, 1, 1, 0],
            easeEach: "none",
          },
        });
      });

      const onPullLeft = contextSafe(() => {
        return gsap.to(tainer.current, {
          id: "leftIn",
          top: "70%",
          keyframes: {
            rotate: [0, 24, 13, 24, 0, 0, -15, 0],
            scale: [1, 1, 1, 1, 0.5, 0.2],
            // top: ["70%", "70%", "85%", "85%"],
            left: ["90%", "89%", "88%", "75%", "10%"],
            opacity: [1, 1, 1, 1, 1, 1, 1, 0],
            easeEach: "none",
          },
          duration: delayTime + 1,
          ease: "power4.out",
        });
      });

      const onStartBounce = contextSafe(() => {
        return gsap.to(title.current, {
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

      const onDefault = contextSafe(() => {
        return gsap.to(tainer.current, {
          id: "default",
          duration: delayTime + 1,
          ease: "power4.out",
          rotate: 0,
          scale: 1,
          top: "50%",
          left: "80%",
          opacity: 1,
        });
      });

      if (currentWindow.current[0] === 1) {
        onPullLeft();
      }

      if (currentWindow.current[1] === 1) {
        onPullMid();
      }

      if (currentWindow.current[2] === 1) {
        onStartBounce();
      }

      if (currentWindow.current.every(defaultPositionTest)) {
        onDefault();
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
    <WorkContainer
      $backgroundColor={color.current}
      ref={tainer}
      data-flip-id="workTainer"
    >
      <TitleWrapper>
        <Title
          style={permanentMarker.style}
          ref={title}
          onClick={() => {
            if (!isAnimating.current) {
              const next = !clicked;
              setClicked(next);
              // logic for setting it back to default needs to be in the animation onComplete so it doesn`t get triggered after loading
              currentWindow.current = next ? [0, 0, 1] : [0, 0, 0];
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
        <WorkEntryWrapper className="contentWrapper" ref={entriesRef}>
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

const Highlights = styled.span`
  color: var(--textAccent);
`;

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
