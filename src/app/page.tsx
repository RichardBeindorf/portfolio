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
    <main id="smooth-wrapper">
      <SmoothWrapper id="smooth-content">
        <TopHalf bottomScroll={bottomScroll} drawDelay={drawDelay} />
        <LowerHalf />
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
      </SmoothWrapper>
    </main>
  );
}

const SmoothWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  overflow-y: hidden;
  /* isolation: isolate; // needed for a color blend setting to work */

  /* pointer-events: none; */ /* causes a lot of bugs! use with care */
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200vh;
  z-index: -1;
  pointer-events: none; /* dont register clicks */
`;
