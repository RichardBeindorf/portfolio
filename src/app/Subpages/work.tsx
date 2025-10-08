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
  animationTime,
  isAnimating,
}: TitleProps) {
  const [clicked, setClicked] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  gsap.registerPlugin(DrawSVGPlugin, Flip);
  const tainer = useRef(null);
  const title = useRef(null);
  const workTL = useRef(null);
  const underline = useRef(null);
  const currentState = useRef(null);
  const flipTL = useRef(null);
  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null);
  const entriesRef = useRef(null);
  const color = useRef("unset");
  const defaultPositionTest = (pos: number) => pos === 0;
  const topDistanceTitle = "5%";
  const leftDistanceTitle = "25%";
  const titleDuration = 1;

  console.log("Work render", Date.now());

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
          gsap.to(title.current, {
            fontSize: "clamp(8vw, 6rem, 11vw)",
            color: "#F24150",
            duration: 2,
            delay: animationTime,
          });
        } else {
          tainer.current.style.setProperty("position", "absolute");
          gsap.set(tainer.current, { left: "80%", top: "50%" });
          gsap.to(title.current, {
            fontSize: "clamp(2vw, 3rem, 4.5vw)",
            color: "var(--foreground)",
            duration: 2,
          });
        }
      },
      animate(self) {
        Flip.from(self.state, {
          targets: tainer.current,
          duration: titleDuration,
          ease: "power4.out",
          delay: 2,
          absolute: true,
          onComplete: () => {
            if (clicked) {
              isAnimating.current = false;
              setShowEntries(true);
              console.log("flip onComplete");
            } else {
              isAnimating.current = false;
              console.log("flip onReverse");
            }
          },
          props: "left, top",
        });
      },
      onStart() {
        if (!clicked) {
          setShowEntries(false);
        }
      },
    });

    batch.run();

    return () => {
      action.kill();
    };
  }, [clicked]);
  // all the flip logic and pulls
  const { contextSafe } = useGSAP(
    () => {
      if (clicked) {
        // if (flipTL.current) {
        //   flipTL.current.kill();
        // }
        // const state = Flip.getState(tainer.current);
        // all the changes i want to apply
        // tainer.current.style.setProperty("position", "relative");
        // gsap.set(tainer.current, { left: "10%", top: "25%" });
        // gsap.to(title.current, {
        //   fontSize: "clamp(8vw, 6rem, 11vw)",
        //   color: "#F24150",
        //   duration: 2,
        //   delay: animationTime,
        // });
        // tainer.current.getBoundingClientRect();
        //   requestAnimationFrame(() => {
        //     // the actual flip
        //   //   flipTL.current = Flip.from(state, {
        //   //     targets: tainer.current,
        //   //     duration: titleDuration,
        //   //     ease: "power4.out",
        //   //     delay: 2,
        //   //     absolute: true,
        //   //     onComplete: () => {
        //   //       isAnimating.current = false;
        //   //       setShowEntries(true);
        //   //       console.log("flip onComplete", Date.now());
        //   //     },
        //   //     onReverseComplete: () => {
        //   //       isAnimating.current = false;
        //   //       console.log(
        //   //         "onReverseComplete fired",
        //   //         Date.now(),
        //   //         showEntries,
        //   //         "showEntries"
        //   //       );
        //   //       flipTL.current = null;
        //   //     },
        //   //     props: "left, top",
        //   //   });
        //   // });
      }

      //reverse
      // if (!clicked) {
      //   setShowEntries(false);
      //   tainer.current.style.setProperty("position", "absolute");

      //   if (
      //     flipTL.current &&
      //     !flipTL.current.isActive() &&
      //     flipTL.current.time() !== 0
      //   ) {
      //     gsap.to(title.current, {
      //       fontSize: "clamp(2vw, 3rem, 4.5vw)",
      //       color: "var(--foreground)",
      //       duration: 2,
      //     });
      //     console.log(
      //       "FLIP REVERSE",
      //       flipTL.current?.progress(),
      //       flipTL.current?.reversed()
      //     );
      //     flipTL.current.reverse();
      //   }
      // }

      // trigger pulls when other titles get clicked
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
          duration: animationTime + 1,
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
        // onDefault();
      }
      // clearing the timeline shortly after giving the command to revers to prevent errors
      currentState.current = null;
    },
    {
      scope: tainer,
      dependencies: [clicked],
      revertOnUpdate: false,
    }
  );

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
          // onReverseComplete: () => {
          //   setShowEntries(false);
          // },
        });
      }
      if (showEntries && entryStaggerAnimation.current) {
        entryStaggerAnimation.current.play();
      }
      if (!showEntries && isAnimating.current) {
        entryStaggerAnimation.current.reverse();
        // entryStaggerAnimation.current = null;
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

      console.log(showEntries, "showEntries");

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
              currentWindow = next ? [0, 0, 1] : [0, 0, 0];
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
