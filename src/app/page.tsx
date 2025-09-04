"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { DrawSVGPlugin, MotionPathPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";

export default function Home() {
  gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);
  const threeLineRef = useRef<ThreeLineMethods | null>(null);
  const titleRef = useRef(null);
  const directionHelper = useRef(null);
  const path = useRef<gsap.core.Tween | null>(null);
  const mask = useRef<gsap.core.Tween | null>(null);
  const arrow = useRef(null);
  const [bottomScroll, setBottomScroll] = useState(false);
  const drawDelay = 3000;
  // const thoughtRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
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
        <TopHalf>
          <Title ref={titleRef} style={permanentMarker.style}>
            Hi, i`m Richard <br /> a &lt; Creative Developer /&gt; <br /> based
            in Hamburg
          </Title>
          <ThoughtSVG drawDelay={drawDelay} />
          <ScribbleFigure drawDelay={drawDelay} />
          <DirectionHelper
            height="350px"
            width="350px"
            viewBox="-10 -10 550 550"
            ref={directionHelper}
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
            {/* <circle cx={0} cy={150} r={3} fill="red" />
            <circle cx={40} cy={-85} r={3} fill="red" />
            <circle cx={120} cy={100} r={3} fill="red" />
            <circle cx={120} cy={130} r={3} fill="red" /> */}
          </DirectionHelper>
          <Arrow ref={arrow} height="15" width="15" viewBox="0 -10 20 20">
            <path id="arrowPath" d="M 0 3 L 10 -4 L 10 10 z" fill="#c8c8c8" />
          </Arrow>
        </TopHalf>
        <LowerHalf />
      </SmoothWrapper>
    </WelcomeMain>
  );
}

const WelcomeMain = styled.main``;

const DirectionHelper = styled.svg`
  position: absolute;
  top: 35%;
  left: 65%;
  visibility: hidden;
`;

const Arrow = styled.svg`
  position: absolute;
  top: 35%;
  left: 65%;
  visibility: hidden;
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
