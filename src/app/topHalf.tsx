import styled from "styled-components";
import { ThoughtSVG } from "./SVG`s/thoughtSVG";
import ScribbleFigure from "./SVG`s/scribbleFigure";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { CustomEase, DrawSVGPlugin, MotionPathPlugin } from "gsap/all";
import gsap from "gsap";

interface TopHalfProps {
  bottomScroll: boolean;
  drawDelay: number;
  resizeDelta: [number, number] | null;
}

export function TopHalf({
  bottomScroll,
  drawDelay,
  resizeDelta,
}: TopHalfProps) {
  gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);
  const directionHelper = useRef(null);
  const path = useRef<gsap.core.Tween | null>(null);
  const mask = useRef<gsap.core.Tween | null>(null);
  const arrow = useRef(null);

  const layoutSwitch = resizeDelta[0] !== null ? resizeDelta[0] : 1;
  const helperHeight = `${350 * layoutSwitch}px`;
  const helperWidth = `${350 * layoutSwitch}px`;
  const arrowHeight = `${15 * layoutSwitch}px`;
  const arrowWidth = `${15 * layoutSwitch}px`;
  const helperViewportHeight = 550;
  const helperViewportWidth = 550;
  const helperViewport = `-10 -10 ${helperViewportHeight} ${helperViewportWidth}`;

  useGSAP(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "arrowEase1",
      "M0,0 C0.487,0.616 0.7,0.615 0.791,0.615 0.881,0.615 0.958,1 1,1.012"
    );
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
          duration: 3,
          ease: "arrowEase1",
          delay: 0,
        }
      );
      path.current = gsap.to(arrow.current, {
        onStart: () => {
          gsap.set(arrow.current, { visibility: "visible" });
          gsap.set(directionHelper.current, { visibility: "visible" });
        },
        duration: 3,
        delay: 0,
        ease: "arrowEase1",
        motionPath: {
          path: "#pathGroup",
          align: "#pathGroup",
          // autoRotate: 180,
          alignOrigin: [0.5, 0.65],
          start: 1.0,
          end: 0,
        },
      });
    }

    if (bottomScroll) {
      mask.current.kill();
      path.current.kill();

      gsap.to(".helperWrapper", {
        duration: 2,
        opacity: 0,
        ease: "power4.in",
      });
    }
  }, [bottomScroll]);

  return (
    <TopWrapper>
      <FigureWrapper>
        <ThoughtSVG drawDelay={drawDelay} resizeDelta={resizeDelta[0]} />
        <ScribbleFigure drawDelay={drawDelay} resizeDelta={resizeDelta[0]} />
      </FigureWrapper>

      <HelperWrapper className="helperWrapper">
        <DirectionHelper
          height={350}
          width={350}
          viewBox={helperViewport}
          ref={directionHelper}
        >
          <defs>
            {/* <mask id="helperMask" maskUnits="userSpaceOnUse">
              <path
                id="maskPath"
                d="M 0 350 C 50 55, 110 330, 110 330 C 180 -60, 320 200, 320
                  295"
                stroke="#fff"
                fill="none"
                strokeLinecap="round"
                strokeWidth="5px"
              />
            </mask> */}
          </defs>
          <g mask="url(#helperMask)">
            <path
              id="pathGroup"
              mask="url(#maskPath)"
              // d="M 0 350 C 50 55, 110 330, 110 330 C 180 -60, 320 200, 320 295"
              d="M 200 350 C 210 60, 260 10, 260 5 C 290 -40, 340 100, 350 495"
              stroke="#e3e2e2"
              strokeWidth="3px"
              strokeDasharray="17"
              fill="transparent"
              markerStart="url(#arrow)"
              className="directionHelper"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
          {/* Just some helper points in case i need to work on the form again */}
          <circle cx={200} cy={350} r={3} fill="red" />
          <circle cx={210} cy={60} r={3} fill="red" />
          <circle cx={260} cy={10} r={3} fill="red" />
          <circle cx={260} cy={5} r={3} fill="red" />
          <circle cx={290} cy={0} r={3} fill="red" />
          <circle cx={420} cy={395} r={3} fill="red" />
        </DirectionHelper>
        <Arrow
          ref={arrow}
          // height={arrowHeight}
          // width={arrowWidth}
          fill="#c8c8c8"
          width="30px"
          height="30px"
          viewBox="0 0 35 35"
          data-name="Layer 2"
          id="a79254cb-3f14-4275-904f-2c1744762c58"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.5,34.75A12.9,12.9,0,0,1,4.61,21.86V13.14a12.89,12.89,0,0,1,25.78,0v8.72A12.9,12.9,0,0,1,17.5,34.75Zm0-32A10.4,10.4,0,0,0,7.11,13.14v8.72a10.39,10.39,0,0,0,20.78,0V13.14A10.4,10.4,0,0,0,17.5,2.75Z" />
          <path d="M17.5,15.844a1.25,1.25,0,0,1-1.25-1.25V8.376a1.25,1.25,0,0,1,2.5,0v6.218A1.25,1.25,0,0,1,17.5,15.844Z" />
        </Arrow>
      </HelperWrapper>
    </TopWrapper>
  );
}

const TopWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  height: 100vh;
  width: 100%;
`;

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
  height: 100vh;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
`;

const DirectionHelper = styled.svg`
  opacity: 1;
`;

const Arrow = styled.svg`
  opacity: 1;
`;
