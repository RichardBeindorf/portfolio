"use client";

import LowerHalf from "./lowerHalf";
import { TopHalf } from "./topHalf";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import CameraSetup from "./Three/cameraSetup";
import { permanentMarker } from "@/styles/font";
import { useEffect, useRef, useState } from "react";
import InteractionHandler from "./Three/interactionHandler";
import ThreeLine, { ThreeLineMethods } from "@/app/Three/threeLine";

export type PullVariants = "left" | "mid" | "right" | "default";

export default function Home() {
  const [bottomScroll, setBottomScroll] = useState(false);
  const [resizeDelta, setResizeDelta] = useState<number | null>(null);
  const [pullDirection, setPullDirection] = useState<PullVariants>("default");
  const threeLineRef = useRef<ThreeLineMethods | null>(null);
  const titleRef = useRef(null);
  const drawDelay = 3000;

  const mobileTest = /Android|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  useEffect(() => {
    const startingWidth = window.innerWidth;
    const idealWidth = 1680;
    const calc = (startingWidth / idealWidth) * 1.1;

    setResizeDelta(calc < 1 && calc > 0 ? calc : 1);

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
                mobileTest={mobileTest}
              />
              <LowerHalf
                resizeDelta={resizeDelta}
                pullDirectionProp={setPullDirection}
                pullDirection={pullDirection}
                mobileTest={mobileTest}
              />
            </>
          )}
          <CanvasWrapper>
            <Canvas orthographic>
              <CameraSetup />
              <ThreeLine
                lineApiRef={threeLineRef}
                drawDelay={drawDelay}
                resizeDelta={resizeDelta}
              />
              <InteractionHandler
                lineApiRef={threeLineRef}
                drawDelay={drawDelay}
                pullDirection={pullDirection}
                bottomScroll={setBottomScroll}
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
