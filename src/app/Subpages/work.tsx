"use client";

import gsap from "gsap";
import { preload } from "react-dom";
import { useGSAP } from "@gsap/react";
import styled from "styled-components";
import { TitleConfig } from "../lowerHalf";
import LeftArrow from "../SVG`s/leftArrow";
import BMSOne from "../SVG`s/bmsMockupOne";
import BMSTwo from "../SVG`s/bmsMockupTwo";
import RightArrow from "../SVG`s/rightArrow";
import { DrawSVGPlugin, Flip } from "gsap/all";
import { useLayoutEffect, useRef, useState } from "react";
import { oswald300, permanentMarker } from "@/styles/font";
import { ChapterTitle, Intro, TitleWrapper } from "./story";

export default function Work({ config }: TitleConfig) {
  const {
    pullDirection,
    pullDirectionProp,
    currentWindow,
    delayTime,
    isAnimating,
    resizeDelta,
    positionsObj,
    spacerHeight,
  } = config;
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
  const underlineWidth = 650 * Math.min(resizeDelta * 1.5, 1);
  const strokeWidth = 2.5 * Math.min(resizeDelta * 1.5, 1);

  const nextProject = () => setCurrentProject((p) => (p + 1) % projects.length);

  const prevProject = () =>
    setCurrentProject((p) => (p - 1 + projects.length) % projects.length);

  const projects = [
    {
      title: "App-Hub",
      description:
        "I had the honor of creating the first customer-related entry point for Buildlinx. The App-Hub connects all customers with the Buildlinx universe and accumulates all necessary applications for users and devs based on roles and rights.",
      imageSrc: ["/AppHubOne806.jpg", "/AppHubTwo822.jpg"],
      imageSrcSet: [
        "/AppHubOne355.jpg 355w, /AppHubOne806.jpg 806w, /AppHubOne1612.jpg 1612w, /AppHubOne3224.jpg 3224w",
        "/AppHubTwo362.jpg 362w, /AppHubTwo822.jpg 822w, /AppHubTwo1644.jpg 1644w, /AppHubTwo3288.jpg 3288w",
      ],
      imageSizes: [
        "(max-width: 412px) 355px, (max-width: 1000px) 806px, (max-width: 1921px) 1612px",
        "(max-width: 412px) 362px, (max-width: 1000px) 822px, (max-width: 1921px) 1644px",
      ],
    },
    {
      title: "Building-Management System",
      description:
        "My biggest project yet, designed and implemented in a complex environment. Unfortunately it is under NDA protection, but i got the permission to scetch a little mockup of it for you. This building management system enables the user to controll and monitor the status not just of stand-alone real estate but an entire fleet of it. I started with a redesign of the old system and then implemented it including a more maintainable algorithm to connect all buildings down to the last room with our complex backend. All rooms show information about temperature, humidity and CO2 levels.",
      svg: [<BMSOne key={1} />, <BMSTwo key={2} />],
    },
    {
      title: "Leapout",
      description:
        "This was my first major milestone, a fully functional Activity App with location planning, activity database, weather report and much more!",
      iframe: "https://activities-app-kappa.vercel.app/",
    },
  ];

  function handleClick() {
    preload("/AppHubOne806.jpg", {
      as: "image",
      imageSrcSet:
        "/AppHubOne355.jpg 355w, /AppHubOne806.jpg 806w, /AppHubOne1612.jpg 1612w, /AppHubOne3224.jpg 3224w",
      imageSizes:
        "(max-width: 412px) 355px, (max-width: 1000px) 806px, (max-width: 1921px) 1612px",
    });

    preload("/AppHubTwo822.jpg", {
      as: "image",
      imageSrcSet:
        "/AppHubTwo362.jpg 362w, /AppHubTwo822.jpg 822w, /AppHubTwo1644.jpg 1644w, /AppHubTwo3288.jpg 3288w",
      imageSizes:
        "(max-width: 412px) 362px, (max-width: 1000px) 822px, (max-width: 1921px) 1644px",
    });

    if (!isAnimating.current) {
      const next = !clicked;

      setClicked(next);

      if (pullDirection === "default") {
        currentWindow.current = [0, 0, 1];
        pullDirectionProp("right");
      }
      if (pullDirection === "right") {
        spacerHeight(0);
        pullDirectionProp("default");
      }

      isAnimating.current = true;
    }
  }

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
          tainer.current.style.position = "relative";
          tainer.current.style.top = "15%";
          tainer.current.style.left = "10%";
        } else {
          tainer.current.style.position = "absolute";
          tainer.current.style.top = "45%";
          tainer.current.style.left = positionsObj.work;
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
          }),
          0
        );

        // if (innerRef.current) {
        //   const targetHeight = clicked ? "auto" : title.current.clientHeight;

        //   tl.to(
        //     innerRef.current,
        //     {
        //       height: targetHeight,
        //       duration: 0.1,
        //     },
        //     0
        //   );
        // }

        if (clicked) {
          tl.add(
            gsap.to(title.current, {
              scale: 2.25,
              transformOrigin: "left bottom",
              keyframes: {
                color: ["#262626", "#F24150"],
              },
              duration: 1,
              delay: delayTime,
            }),
            0
          );
        }

        // clicked to close title but we are not done animating
        if (isAnimating.current && !clicked && currentWindow.current[2] === 1) {
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
        isAnimating.current = true;
        if (!clicked) {
          setShowEntries(false);
          currentWindow.current = [0, 0, 0];
        }
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
      // const onStartBounce = contextSafe(() => {
      //   return gsap.to(title.current, {
      //     delay: 0.7,
      //     ease: "sine.in",
      //     keyframes: {
      //       scaleX: ["100%", "80%", "100%"],
      //       // left: ["45%", "42%", "45%"],
      //       rotate: [0, -10, 0],
      //       easeEach: "none",
      //     },
      //   });
      // });

      // if (currentWindow.current[2] === 1 && clicked) {
      //   onStartBounce();
      // }

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

  // Pull Animations: Defining Timelines
  useGSAP(() => {
    let yAnimationValue = window.innerHeight * 0.35;
    let xMidValue = window.innerWidth * 0.3;
    let xLeftValue = -window.innerWidth * 0.7;

    const sharedKeyframes = {
      // 8 different phases maximum currently
      // first is start position
      rotate: [0, 24, 13, 24, 0, 0, -15, 0],
      scale: [1, 1, 1, 1, 0.5, 0.1],
      opacity: [1, 1, 1, 1, 1, 1, 0, 0],
      easeEach: "none",
    };

    workLeft.current = gsap
      .timeline({
        paused: true,
        id: "workLeft",
      })
      .to(tainer.current, {
        duration: pullDuration,
        ease: "power1.in",
        keyframes: {
          ...sharedKeyframes,
          x: [0, 0, xLeftValue, xLeftValue],
        },
      });

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
          ...sharedKeyframes,
          y: [0, 0, yAnimationValue, yAnimationValue],
          x: [0, 0, -xMidValue, -xMidValue],
        },
      });
  }, []);

  // Pull Animations: Controll Logic
  useGSAP(() => {
    if (!workMid.current || !workLeft.current) return;

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
      // $backgroundColor={color.current}
      $position={positionsObj.work}
      ref={tainer}
    >
      <TitleWrapper>
        <Title style={permanentMarker.style} ref={title} onClick={handleClick}>
          Work
        </Title>
        {showEntries && (
          <svg width={underlineWidth} height="20">
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
              {projects[currentProject].imageSrc && (
                <ImageGallery>
                  {projects[currentProject].imageSrc.map((src, idx) => (
                    <PreviewImage
                      key={idx}
                      src={src}
                      srcSet={projects[currentProject].imageSrcSet[idx]}
                      sizes={projects[currentProject].imageSizes[idx]}
                    />
                  ))}
                </ImageGallery>
              )}
              {projects[currentProject].svg && (
                <SVGWrapper>
                  {projects[currentProject].svg.map((svg) => svg)}
                </SVGWrapper>
              )}
            </DetailWrapper>
          </TopicWrapper>

          <NavButtons>
            <ButtonWrapper onClick={prevProject}>
              <LeftArrow />
              <button
                style={{
                  ...permanentMarker.style,
                  paddingLeft: "0.2rem",
                  fontSize: "var(--inlineText)",
                }}
              >
                Prev
              </button>
            </ButtonWrapper>
            <ButtonWrapper onClick={nextProject}>
              <button
                style={{
                  ...permanentMarker.style,
                  paddingRight: "0.2rem",
                  fontSize: "var(--inlineText)",
                }}
              >
                Next
              </button>
              <RightArrow />
            </ButtonWrapper>
          </NavButtons>
        </WorkEntryWrapper>
      )}
    </WorkContainer>
  );
}

const WorkContainer = styled.section<{ $position: string }>`
  position: absolute;
  top: 45%;
  left: ${(props) => props.$position || "80%"};

  width: max-content;
  max-width: 80vw;

  pointer-events: auto;
  will-change: transform;

  /* @media (orientation: portrait) {
    left: 35%;
  } */
`;

const WorkEntryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
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
  font-size: var(--subTitle);
  color: var(--textAccent);
`;

const Text = styled.p`
  font-size: var(--inlineText);
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
  margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover svg path {
    stroke: #f24150;
  }

  button {
    background: var(--background);
    color: var(--foreground);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
  }

  &:hover button {
    color: #f24150;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.7rem;
  margin-top: 1rem;

  @media only screen and (max-width: 400px) {
    flex-direction: column;
  }
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

  @media only screen and (max-width: 400px) {
    width: 80vw;
  }
`;

const SVGWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.7rem;
  margin-top: 1rem;

  @media only screen and (max-width: 400px) {
    flex-direction: column;
  }
`;
