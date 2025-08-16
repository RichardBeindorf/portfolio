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
import { ThoughtSVG } from "@/components/newThought";

export default function Home() {
  const threeLineRef = useRef<ThreeLineMethods | null>(null);
  const titleRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      titleRef.current.style.transition = "opacity 1s ease-out";
      titleRef.current.style.opacity = "0";
    }, 3000);
  }, []);

  return (
    <WelcomeMain id="smooth-wrapper">
      <SmoothWrapper id="smooth-content">
        <CanvasWrapper>
          <Canvas orthographic>
            <CameraSetup />
            <ThreeLine lineApiRef={threeLineRef} />
            <InteractionHandler lineApiRef={threeLineRef} />
          </Canvas>
        </CanvasWrapper>
        <TopHalf>
          <Title ref={titleRef} style={permanentMarker.style}>
            Hi, i`m Richard <br /> a &lt; Creative Developer /&gt; <br /> based
            in Hamburg
          </Title>
          <ThoughtSVG />
          <ScribbleFigure />
        </TopHalf>
        <LowerHalf />
      </SmoothWrapper>
    </WelcomeMain>
  );
}

const WelcomeMain = styled.main``;

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
  z-index: 3;
`;
