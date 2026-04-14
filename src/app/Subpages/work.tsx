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
import { ChapterTitle, TitleWrapper } from "./story";
import handlePopStateChange from "@/util/popStateHandler";
import Link from "next/link";

export default function Work({ config }: TitleConfig) {
  const {
    pullDirection,
    pullDirectionProp,
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

  const workLeft = useRef(null);
  const workMid = useRef(null);

  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null);
  const entriesRef = useRef(null);
  const underline = useRef(null);

  const pullDuration = 1;
  const underlineWidth = 650 * Math.min(resizeDelta * 1.5, 1);
  const strokeWidth = 2.5 * Math.min(resizeDelta * 1.5, 1);

  const nextProject = () => {
    spacerHeight(tainer.current.getBoundingClientRect().height);
    setCurrentProject((p) => (p + 1) % projects.length);
  };

  const prevProject = () => {
    spacerHeight(tainer.current.getBoundingClientRect().height);
    setCurrentProject((p) => (p - 1 + projects.length) % projects.length);
  };

  const projects = [
    {
      title: "App-Hub",
      description:
        "I had the honor of creating the first customer-related entry point for Buildlinx. The App-Hub connects all customers with the Buildlinx universe and accumulates all necessary applications for users and devs based on roles and rights.",
      features: [
        "Implemented a role-based authentication and authorization system",
        "Developed a personalized dashboard as the application entry point",
        "Created a custom UI/UX design",
        "Built animated application cards with expandable additional information",
      ],
      // url: "dashboard.buildlinx.io/overview",
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
      title: "CineKitchen",
      description:
        "My take on a cinema app, enabling users to plan a movie night with ease. *work in progress* - next features: showtimes, admin board, ticket ordering/shop and more!",
      iframe: "https://cinekitchen.vercel.app/",
      url: "https://cinekitchen.vercel.app/",
      gitHub:
        "https://gitlab.com/RichardBeindorf1/CineMatik/-/tree/48e9149eeb566e55a636cf487a1c2799bf928212/",
      features: [
        "Authentication with NextAuth (credentials, sessions & JWT) using Prisma and SQLite.",
        "Shareable movie lists for collaborative group movie planning.",
        "Movie data synced from an external API and served from a local SQLite database to avoid slow requests.",
        "Swipeable card-stack interface for discovering movies.",
        "React frontend with Redux Toolkit and Tailwind CSS.",
        "Node/Express backend handling API integration and data sync.",
        "Skeleton loading states to smooth backend cold starts.",
        "Dynamic route and arrival planning.",
        "End to End testing via Playwright.",
      ],
      technical: [
        "Slow third-party responses: Caching API data locally.",
        "Scalable statemanagement: Feature-based Redux structure separates UI state and server state.",
      ],
    },
    {
      title: "Building-Management System",
      description:
        "My biggest (NDA protected) project yet, designed and implemented in a complex technical environment. The BMS enables users to controll and monitor the status of an entire realestade fleet. I started with a redesign of the old system and then implemented it including a more maintainable algorithm to connect all buildings down to the last room with our complex backend. All rooms show information about temperature, humidity and CO2 levels.",
      svg: [<BMSOne key={1} />, <BMSTwo key={2} />],
      features: [
        "Developed a centralized heating management system for public buildings in Hamburg",
        "Implemented hierarchical visualizations ranging from city-wide maps down to individual room layouts",
        "Built real-time temperature control with monitoring for humidity, CO₂, and additional environmental metrics",
        "Modernized a legacy user interface into a responsive and user-friendly design",
      ],
    },
    {
      title: "Leapout",
      description:
        "This was my first major milestone, a fully functional Activity App with location planning, activity database, weather report and much more!",
      iframe: "https://leapoutrb.vercel.app/",
      features: [
        "Optimized database queries to deliver relevant search results",
        "Implemented an interactive activity map with dynamic location-based filtering",
        "Integrated an image API for automatic activity image retrieval",
        "Designed an intuitive UX focused on usability and quality assurance",
      ],
      url: "https://activities-app-kappa.vercel.app/",
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
        pullDirectionProp("right");
        window.history.pushState({ name: "right" }, "pushing right", "#right");
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
    if (isInitial.current) {
      // Skip the first render
      isInitial.current = false;
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
          spacerHeight,
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
          spacerHeight,
        );
      });
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
          0,
        );

        if (clicked) {
          // Bounce when other titles crash in
          tl.add(
            gsap.to(title.current, {
              duration: 0.35,
              delay: 0.65,
              ease: "sine.in",
              transformOrigin: "right center",
              keyframes: {
                scaleX: [1.0, 0.7, 1.0],
                skewY: [0, 10, 0],
                easeEach: "none",
              },
            }),
            0,
          );

          // Second Bounce = Passion crashing into Work
          tl.add(
            gsap.to(title.current, {
              duration: 0.2,
              delay: 1.22,
              ease: "sine.in",
              transformOrigin: "right center",
              keyframes: {
                scaleX: [1.0, 0.9, 1.0],
                skewY: [0, 10, 0],
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
              scale: 1,
              keyframes: {
                color: ["#F24150", "#262626"],
              },
              duration: 1,
            }),
            0,
          );
        }
      },
      // since this .from will be called forward and backwards we need to close the entries on start, also making sure
      onStart() {
        isAnimating.current = true;
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

  // Logic for animating content of this title, only entries related
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
      //still have to reverse the underline
    },
    {
      scope: tainer,
      dependencies: [showEntries],
      revertOnUpdate: false,
    },
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
      scale: [1, 1, 0.5, 0.2, 0.1],
      opacity: [1, 1, 1, 1, 0.5, 0, 0, 0],
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
        if (clicked) setClicked(false); // User clicks outside the title box to leave the screen
        spacerHeight(undefined); // reversing the spacer here so its on 0 for any interaction closing the window
    }
  }, [pullDirection]);

  return (
    <WorkContainer $position={positionsObj.work} ref={tainer}>
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
          <TopicWrapper>
            <Topic style={permanentMarker.style}>
              {projects[currentProject].title}
              {projects[currentProject].url && (
                <Link href={projects[currentProject].url}>
                  <svg
                    width="36"
                    height="36"
                    fill="none"
                    style={{
                      scale: "80%",
                      transform: "translateY(20%)",
                      marginLeft: "10px",
                    }}
                  >
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M19 9.6c-2 0-10-.4-15.2.8-4.5 1-2.4 9.4-1.8 14q.2 1.5 1.2 2.4c5.3 4.2 17.7 0 22.6-.9q1.6-2.1 1.1-5.9 0-2-.4-6.4"
                    />
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M15.2 19q.2 0 2.7-2.2l4-3.8 6.7-6"
                    />
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M20.2 6.3a45 45 0 0 1 12-5.3c1 0 1.5 1.2 1.8 2.4q.3 4.3-.3 8.4c-.1 1.2-.1 2.2-.8 5.5"
                    />
                  </svg>
                </Link>
              )}
              {projects[currentProject].gitHub && (
                <Link
                  href={projects[currentProject].gitHub}
                  style={{
                    height: "36px",
                    display: "inline-block",
                    transform: "translateY(15%)",
                  }}
                >
                  <svg
                    viewBox="0 0 380 380"
                    fill="black"
                    height={36}
                    width={36}
                  >
                    <g id="LOGO">
                      <path
                        className="cls-1"
                        d="M282.83,170.73l-.27-.69-26.14-68.22a6.81,6.81,0,0,0-2.69-3.24,7,7,0,0,0-8,.43,7,7,0,0,0-2.32,3.52l-17.65,54H154.29l-17.65-54A6.86,6.86,0,0,0,134.32,99a7,7,0,0,0-8-.43,6.87,6.87,0,0,0-2.69,3.24L97.44,170l-.26.69a48.54,48.54,0,0,0,16.1,56.1l.09.07.24.17,39.82,29.82,19.7,14.91,12,9.06a8.07,8.07,0,0,0,9.76,0l12-9.06,19.7-14.91,40.06-30,.1-.08A48.56,48.56,0,0,0,282.83,170.73Z"
                      />
                    </g>
                  </svg>
                </Link>
              )}
            </Topic>
            <Text style={oswald300.style}>
              {projects[currentProject].description}
            </Text>
            <DetailWrapper>
              {/* If we have an iFrame version */}
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
              {/* SVG visiulisation of the project */}
              {projects[currentProject].svg && (
                <SVGWrapper>
                  {projects[currentProject].svg.map((svg) => svg)}
                </SVGWrapper>
              )}
              {/* Featuer and details about the project */}
              <FeaturesWrapper>
                <FeaturesTitle style={permanentMarker.style}>
                  Features
                </FeaturesTitle>
                <EntryWrapper>
                  {projects[currentProject].features.map((feature, index) => (
                    <FeatureEntry style={oswald300.style} key={index}>
                      {feature}
                    </FeatureEntry>
                  ))}
                </EntryWrapper>
              </FeaturesWrapper>
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
  -webkit-tap-highlight-color: transparent; // stop the background highlight in safar browser when clicked/tapped
  will-change: transform;
`;

const WorkEntryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0px;
  background-color: var(--background);
`;

const TopicWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const DetailWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-top: 2rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
`;

const EntryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const FeatureEntry = styled.p`
  font-size: var(--inlineText);
  margin: 10px 0px 10px 0px;
  line-height: 1.5rem;
`;

const FeaturesTitle = styled.h1`
  color: var(--textAccent);
`;

const Topic = styled.h3`
  font-size: var(--subTitle);
  color: var(--foreground);
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
  justify-self: center;
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
  transform-origin: right;
`;

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
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1.7rem;
  margin-top: 1rem;

  @media only screen and (max-width: 400px) {
    flex-direction: column;
  }
  justify-self: center;
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
  justify-self: center;
`;

const SVGWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1.7rem;
  margin-top: 1rem;

  @media only screen and (max-width: 400px) {
    flex-direction: column;
  }
  justify-self: center;
`;
