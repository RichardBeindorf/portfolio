"use client";
import React, { useRef } from "react";
import styled from "styled-components";
import CameraSetup from "./cameraSetup";
import { permanentMarker } from "../styles/font";
import { Canvas } from "@react-three/fiber";
import InteractionHandler from "./interactionHandler";
import ScribbleFigure from "@/components/scribbleFigure";
import ThreeLine, { ThreeLineMethods } from "@/components/threeLine";

export default function Home() {
  const threeLineRef = useRef<ThreeLineMethods | null>(null);
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
          <Title style={permanentMarker.style}>
            Hi, i`m Richard <br /> a &lt; Creative Developer /&gt; <br /> based
            in Hamburg
          </Title>
          <ScribbleFigure />
        </TopHalf>
        <LowerHalf>
          <Story style={permanentMarker.style}> Story </Story>
          <Work style={permanentMarker.style}> Work </Work>
          <Passion style={permanentMarker.style}> Passion </Passion>
        </LowerHalf>
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

const TopHalf = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const LowerHalf = styled(TopHalf)``;

const Title = styled.h1`
  color: #f24150;
  mix-blend-mode: normal;
  font-size: clamp(2vw, 3rem, 4.5vw);
  text-align: center;
  z-index: 3;
`;

const Work = styled(Title)`
  position: absolute;
  top: 70%;
  left: 20%;
  color: var(--foreground);
`;

const Passion = styled(Title)`
  position: absolute;
  top: 70%;
  left: 80%;
  color: var(--foreground);
`;

const Story = styled(Title)`
  position: absolute;
  top: 85%;
  left: 50%;
  color: var(--foreground);
`;
