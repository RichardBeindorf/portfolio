"use client";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import CameraSetup from "./cameraSetup";
import { permanentMarker } from "../styles/font";
import { Canvas } from "@react-three/fiber";
import InteractionHandler from "./interactionHandler";
import ScribbleFigure from "@/components/scribbleFigure";
import ThreeLine, { ThreeLineMethods } from "@/components/threeLine";
import LowerHalf from "./lowerHalf";
import { ThoughtSVG } from "@/components/thoughtSVG";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const threeLineRef = useRef<ThreeLineMethods | null>(null);
  const titleRef = useRef(null);
  const drawDelay = 3000;
  const directionHelper = useRef(null);
  gsap.registerPlugin(DrawSVGPlugin);
  // const thoughtRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      titleRef.current.style.transition = "opacity 1s ease-out";
      titleRef.current.style.opacity = "0";
    }, drawDelay);
  }, []);

  useGSAP(() => {
    if (directionHelper.current) {
      gsap.fromTo(
        directionHelper.current,
        { drawSVG: "100% 100%" },
        { drawSVG: "0% 100%", duration: 1.5, ease: "power1.in" }
      );
    }
  });

  return (
    <WelcomeMain id="smooth-wrapper">
      <SmoothWrapper id="smooth-content">
        <CanvasWrapper>
          <Canvas orthographic>
            <CameraSetup />
            <ThreeLine lineApiRef={threeLineRef} drawDelay={drawDelay} />
            <InteractionHandler
              lineApiRef={threeLineRef}
              drawDelay={drawDelay}
            />
          </Canvas>
        </CanvasWrapper>
        <TopHalf>
          <Title ref={titleRef} style={permanentMarker.style}>
            Hi, i`m Richard <br /> a &lt; Creative Developer /&gt; <br /> based
            in Hamburg
          </Title>
          {/* <ThoughtSVG drawDelay={drawDelay} />
          <ScribbleFigure drawDelay={drawDelay} /> */}
          <DirectionHelper
            height="350px"
            width="350px"
            viewBox="-10 -10 550 550"
          >
            <defs>
              <marker
                id="arrow"
                markerHeight="15"
                markerWidth="15"
                refX="3"
                refY="3"
                viewBox="0 -10 20 20"
                orient="auto"
              >
                <path d="M 0 2 L 8 -2 L 6 8 z" fill="#b2b2b2" />
              </marker>

              <mask id="helperMask" maskUnits="userSpaceOnUse"></mask>
            </defs>
            <path
              ref={directionHelper}
              // d="M 0 350 C 50 55, 110 330, 110 330 M 110 330 C 180 -60, 320 200, 320 295"
              d="M 0 350 C 50 55, 110 330, 110 330 C 180 -60, 320 200, 320 295"
              stroke="#b2b2b2"
              strokeWidth="3px"
              strokeDasharray="17"
              fill="transparent"
              markerStart="url(#arrow)"
              className="directionHelper"
              strokeLinejoin="round"
              strokeLinecap="round"
              // markerMid="url(#arrow)"
            />
            {/* <circle cx={0} cy={150} r={3} fill="red" />
            <circle cx={40} cy={-85} r={3} fill="red" />
            <circle cx={120} cy={100} r={3} fill="red" />
            <circle cx={120} cy={130} r={3} fill="red" /> */}
          </DirectionHelper>
        </TopHalf>
        <LowerHalf />
      </SmoothWrapper>
    </WelcomeMain>
  );
}

const WelcomeMain = styled.main``;

const DirectionHelper = styled.svg`
  position: absolute;
`;

const SmoothWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: calc(100vh * 2);
  background-color: #f2f1e9;
  overflow-y: hidden; // debatable
  isolation: isolate; // needed for a color blend setting to work

  /* pointer-events: none; */ /* causes a lot of bugs! use with care */
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh * 2);
`;

export const TopHalf = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Title = styled.h1`
  color: #f24150;
  mix-blend-mode: normal;
  font-size: clamp(2vw, 3rem, 4.5vw);
  text-align: center;
  cursor: pointer;
  z-index: 3;
`;
