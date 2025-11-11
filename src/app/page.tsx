"use client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CameraSetup from "./Three/cameraSetup";
import { Canvas } from "@react-three/fiber";
import InteractionHandler from "./Three/interactionHandler";
import ThreeLine, { ThreeLineMethods } from "@/app/Three/threeLine";
import LowerHalf from "./lowerHalf";
import { TopHalf } from "./topHalf";
import { permanentMarker } from "@/styles/font";

export type PullVariants = "left" | "mid" | "right" | "default";

export default function Home() {
  const [bottomScroll, setBottomScroll] = useState(false);
  const [resizeDelta, setResizeDelta] = useState<[number, number] | null>(null);
  const [pullDirection, setPullDirection] = useState<PullVariants>("default");
  const threeLineRef = useRef<ThreeLineMethods | null>(null);
  const titleRef = useRef(null);
  const drawDelay = 3000;

  useEffect(() => {
    const startingWidth = window.innerWidth;
    const idealWidth = 1680;
    const calc = 1 - startingWidth / idealWidth;

    setResizeDelta([
      calc < 1 && calc > 0 ? calc : 1,
      startingWidth / idealWidth,
    ]);

    setTimeout(() => {
      titleRef.current.style.transition = "opacity 1s ease-out";
      titleRef.current.style.opacity = "0";
    }, drawDelay);
  }, []);

  return (
    <>
      <h1 className="introTitle" ref={titleRef} style={permanentMarker.style}>
        Hi, i`m Richard <br /> a &lt; Creative Developer /&gt; <br /> based in
        Hamburg
      </h1>
      <main id="smooth-wrapper">
        <SmoothWrapper id="smooth-content">
          {resizeDelta && (
            <>
              <TopHalf
                bottomScroll={bottomScroll}
                drawDelay={drawDelay}
                resizeDelta={resizeDelta}
              />
              <LowerHalf
                resizeDelta={resizeDelta?.[1]}
                pulldirectionProp={setPullDirection}
                pullDirection={pullDirection}
              />
            </>
          )}
          <CanvasWrapper>
            <Canvas orthographic>
              <CameraSetup />
              <ThreeLine
                lineApiRef={threeLineRef}
                drawDelay={drawDelay}
                resizeDelta={resizeDelta?.[0]}
              />
              <InteractionHandler
                lineApiRef={threeLineRef}
                drawDelay={drawDelay}
                pullDirection={pullDirection}
                bottomScroll={(arr) => {
                  setBottomScroll(arr);
                }}
              />
            </Canvas>
          </CanvasWrapper>
        </SmoothWrapper>
      </main>
    </>
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
