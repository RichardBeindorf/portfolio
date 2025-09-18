"use client";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import CameraSetup from "./Three/cameraSetup";
import { Canvas } from "@react-three/fiber";
import InteractionHandler from "./Three/interactionHandler";
import ThreeLine, { ThreeLineMethods } from "@/app/Three/threeLine";
import LowerHalf from "./lowerHalf";
import { TopHalf } from "./topHalf";

export default function Home() {
  const threeLineRef = useRef<ThreeLineMethods | null>(null);
  const [bottomScroll, setBottomScroll] = useState(false);
  const drawDelay = 3000;

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
              bottomScroll={(arr) => {
                setBottomScroll(arr);
              }}
            />
          </Canvas>
        </CanvasWrapper>
        <TopHalf bottomScroll={bottomScroll} drawDelay={drawDelay} />
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
