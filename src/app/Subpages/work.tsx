"use client";

import styled from "styled-components";
import {
  ChapterContainer,
  ChapterTitle,
  EntryList,
  Intro,
  TitleProps,
  TitleWrapper,
} from "./story";
import { oswald300, permanentMarker } from "@/styles/font";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/all";

export default function Work({
  currentWindow,
  setCurrentWindow,
  animationTime,
  isAnimating,
}: TitleProps) {
  const tainer = useRef(null);
  const title = useRef(null);
  const underline = useRef(null);
  gsap.registerPlugin(DrawSVGPlugin);
  const [clicked, setClicked] = useState(false);
  const workTL = useRef(null);
  const currentState = useRef(null);
  const defaultPositionTest = (pos: number) => pos === 0;
  const topDistanceTitle = "54%";
  const leftDistanceTitle = "25%";
  const titleDuration = 1;
  const entriesRef = useRef(null);
  const entryStaggerAnimation = useRef<gsap.core.Tween | null>(null);
  const [showEntries, setShowEntries] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  const color = useRef("unset");

  if (clicked) {
    color.current = "#F2F1E9";
  } else {
    color.current = "unset";
  }

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

  const { contextSafe } = useGSAP(
    () => {
      //**//
      /* MAIN TITLE ANIMATION */
      //**//
      const titleTL = contextSafe(() => {
        const newTL = gsap.timeline({
          paused: true,
          ease: "power4.out",
          delay: animationTime,
          // making sure the animation state is preserved all the way so we can disable any click animation while its on
          onComplete: () => {
            isAnimating.current = false;
            setShowEntries(true);
          },
          onReverseComplete: () => {
            isAnimating.current = false;
            workTL.current = null;
          },
        });
        newTL.to(tainer.current, {
          top: topDistanceTitle,
          left: leftDistanceTitle,
          duration: titleDuration,
        });
        newTL.to(
          title.current,
          {
            fontSize: "clamp(8vw, 6rem, 11vw)",
            color: "#F24150",
            duration: 2,
          },
          "<"
        );
        return newTL;
      });

      if (!workTL.current) {
        // remembering each timeline or we will just creat a new one everytime and cant play or reverse
        workTL.current = titleTL();
      }

      if (workTL.current) {
        if (clicked) {
          workTL.current.play();
        }
        if (!clicked || currentWindow.every(defaultPositionTest)) {
          workTL.current.reverse();
        }
      }

      //**//
      /* ---- END ---- */
      //**//

      const pullDuration = 1;

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

      const onPullMidOut = contextSafe(() => {
        const midOut = gsap.to(tainer.current, {
          display: "block",
          duration: animationTime + 1,
          ease: "power4.out",
          fontSize: "clamp(8vw, 6rem, 11vw)",
          scale: 1,
          top: "70%",
          left: "90%",
          opacity: 1,
          rotate: 0,
        });

        return midOut;
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
          duration: pullDuration,
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
        onPullMidOut();
      }
      // clearing the timeline shortly after giving the command to revers to prevent errors
      currentState.current = null;
    },
    {
      scope: tainer,
      dependencies: [clicked, currentWindow],
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
        entryStaggerAnimation.current = gsap.from(items, {
          opacity: 0,
          y: 20,
          stagger: 0.03,
          duration: 0.2,
          ease: "power2.out",
          paused: true,
          onReverseComplete: () => {
            setShowEntries(false);
          },
        });
      }
      if (showEntries && entryStaggerAnimation.current) {
        entryStaggerAnimation.current.play();
      }
      if (!clicked && isAnimating.current === true) {
        entryStaggerAnimation.current.reverse();
        entryStaggerAnimation.current = null;
        // Animate the contentWrapper back up when entries are reversing out
        shift = gsap.to(".contentWrapper", {
          y: -60,
          ease: "power2.out",
          duration: 0.4,
        });
        shift.play();
        shift.reverse();
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

      if (clicked && !isAnimating.current) {
        drawUnderline();
      }
    },
    {
      scope: tainer,
      dependencies: [showEntries, clicked],
      revertOnUpdate: false,
    }
  );

  return (
    <WorkContainer $backgroundColor={color.current} ref={tainer}>
      <TitleWrapper>
        <Title
          style={permanentMarker.style}
          ref={title}
          onClick={() => {
            if (!isAnimating.current) {
              const next = !clicked;
              setClicked(next);
              setCurrentWindow(next ? [0, 0, 1] : [0, 0, 0]);
              isAnimating.current = true;
            }
          }}
        >
          Work
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

      {clicked && (
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
    </WorkContainer>
  );
}

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

const WorkContainer = styled.section<{ $backgroundColor: string }>`
  top: 70%;
  left: 90%;
  position: absolute;
  transform: translateX(-50%);
  mix-blend-mode: normal;
  padding: 15px;
  border-radius: 15px;
  background-color: ${(props) => props.$backgroundColor};
  border: 0px solid black;
  border-radius: 25px;
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
