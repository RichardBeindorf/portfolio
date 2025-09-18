import styled from "styled-components";
import { ThoughtSVG } from "./Figure/thoughtSVG";
import ScribbleFigure from "./Figure/scribbleFigure";
import { permanentMarker } from "@/styles/font";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin, MotionPathPlugin } from "gsap/all";
import gsap from "gsap";

interface TopHalfProps {
  bottomScroll: boolean;
  drawDelay: number;
}

export function TopHalf({ bottomScroll, drawDelay }: TopHalfProps) {
  const titleRef = useRef(null);
  const [layoutSwitch, setLayoutSwitch] = useState(1);
  gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);
  const directionHelper = useRef(null);
  const path = useRef<gsap.core.Tween | null>(null);
  const mask = useRef<gsap.core.Tween | null>(null);
  const arrow = useRef(null);

  const desktopSize = 1663;
  const helperHeight = `${350 * layoutSwitch}px`;
  const helperWidth = `${350 * layoutSwitch}px`;
  const arrowHeight = `${15 * layoutSwitch}px`;
  const arrowWidth = `${15 * layoutSwitch}px`;
  const helperViewportHeight = 550;
  const helperViewportWidth = 550;
  const helperViewport = `-10 -10 ${helperViewportHeight} ${helperViewportWidth}`;
  // const thoughtRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const currentScreenWidth = document.body.clientWidth;
    const difference = ((100 / desktopSize) * currentScreenWidth) / 100;
    setLayoutSwitch(difference);
    console.log(difference);
    setTimeout(() => {
      titleRef.current.style.transition = "opacity 1s ease-out";
      titleRef.current.style.opacity = "0";
    }, drawDelay);
  }, []);

  useGSAP(() => {
    if (directionHelper.current && arrow.current && !bottomScroll) {
      // Taking the maks path and apply it automaticly to the actual path!
      // Since i drew the path from left to right i have to bend over backwards to get it animated from right to left..
      // key idea is that 100% 100% means the the line drawing starts at the end and ends there, so nothing is drawn
      // then we take that and animate it from 0 to 100, thus we go from end to start!

      mask.current = gsap.fromTo(
        "#maskPath",
        { drawSVG: "100% 100%" },
        {
          drawSVG: "0% 100%",
          duration: 5,
          ease: "power1.in",
          delay: 11,
        }
      );
      path.current = gsap.to(arrow.current, {
        onStart: () => {
          gsap.set(arrow.current, { visibility: "visible" });
          gsap.set(directionHelper.current, { visibility: "visible" });
        },
        duration: 5,
        delay: 11,
        ease: "power1.in",
        motionPath: {
          path: "#pathGroup",
          align: "#pathGroup",
          autoRotate: 180,
          alignOrigin: [0.5, 0.65],
          start: 1.0,
          end: 0,
        },
      });
    }

    if (bottomScroll) {
      mask.current.kill();
      path.current.kill();

      gsap.set(arrow.current, {
        visibility: "hidden",
      });
      gsap.set(directionHelper.current, {
        visibility: "hidden",
      });
    }
  }, [bottomScroll]);

  return (
    <TopWrapper>
      <Title ref={titleRef} style={permanentMarker.style}>
        Hi, i`m Richard <br /> a &lt; Creative Developer /&gt; <br /> based in
        Hamburg
      </Title>
      <FigureWrapper>
        <ThoughtSVG drawDelay={drawDelay} />
        <ScribbleFigure drawDelay={drawDelay} />
      </FigureWrapper>
      <HelperWrapper>
        <DirectionHelper
          height={helperHeight}
          width={helperWidth}
          viewBox={helperViewport}
          ref={directionHelper}

          // height="100%"
          // width="100%"
          // viewBox={helperViewport}
          // ref={directionHelper}
        >
          <defs>
            <mask id="helperMask" maskUnits="userSpaceOnUse">
              <path
                id="maskPath"
                d="M 0 350 C 50 55, 110 330, 110 330 C 180 -60, 320 200, 320
                  295"
                stroke="#fff"
                fill="none"
                strokeLinecap="round"
                strokeWidth="5px"
              />
            </mask>
          </defs>
          <g mask="url(#helperMask)">
            <path
              id="pathGroup"
              mask="url(#maskPath)"
              d="M 0 350 C 50 55, 110 330, 110 330 C 180 -60, 320 200, 320 295"
              stroke="#c8c8c8"
              strokeWidth="3px"
              strokeDasharray="17"
              fill="transparent"
              markerStart="url(#arrow)"
              className="directionHelper"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
          <circle cx={0} cy={350} r={3} fill="red" />
          <circle cx={50} cy={55} r={3} fill="red" />
          <circle cx={110} cy={330} r={3} fill="red" />
          <circle cx={180} cy={-60} r={3} fill="red" />
          <circle cx={320} cy={200} r={3} fill="red" />
          <circle cx={320} cy={295} r={3} fill="red" />
        </DirectionHelper>
        <Arrow
          ref={arrow}
          height={arrowHeight}
          width={arrowWidth}
          viewBox="0 -10 20 20"
        >
          <path id="arrowPath" d="M 0 3 L 10 -4 L 10 10 z" fill="#c8c8c8" />
        </Arrow>
      </HelperWrapper>
    </TopWrapper>
  );
}

const HelperWrapper = styled.div`
  width: 100%;
  align-self: flex-end;
  visibility: visible;

  display: flex;
  justify-content: flex-end;
  transform: translate(5%, 30%);
`;

const FigureWrapper = styled.div`
  position: absolute;
`;

const DirectionHelper = styled.svg``;

const Arrow = styled.svg``;
const Title = styled.h1`
  position: absolute;
  color: #f24150;
  mix-blend-mode: normal;
  font-size: clamp(2vw, 3rem, 4.5vw);
  text-align: center;
  cursor: pointer;
  z-index: 3;
`;

export const TopWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
