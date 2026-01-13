import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import styled from "styled-components";
import { ThoughtSVG } from "./SVG`s/thoughtSVG";
import ScribbleFigure from "./SVG`s/scribbleFigure";

interface TopHalfProps {
  bottomScroll: boolean;
  drawDelay: number;
  resizeDelta: number | null;
  mobileTest: boolean;
}

export function TopHalf({
  bottomScroll,
  drawDelay,
  resizeDelta,
  mobileTest,
}: TopHalfProps) {
  const mouseIcon = useRef(null);

  const layoutSwitch = !mobileTest
    ? Math.min(resizeDelta, 1)
    : Math.min(resizeDelta * 2.3, 1); // on mobile only

  const arrowHeight = `${40 * layoutSwitch}px`;
  const arrowWidth = `${40 * layoutSwitch}px`;

  useGSAP(() => {
    if (mouseIcon.current && !bottomScroll) {
      gsap.to(mouseIcon.current, {
        duration: 1,
        repeat: -1,
        yoyo: true,
        yPercent: 200,
        delay: (drawDelay / 1000) * 3,
        ease: "power1.in",
        onStart: () => {
          gsap.set(mouseIcon.current, { visibility: "visible", opacity: 1 });
        },
      });
    }

    if (bottomScroll) {
      gsap.to(".helperWrapper", {
        duration: 1.5,
        opacity: 0,
        ease: "power4.in",
      });
    }
  }, [bottomScroll]);

  return (
    <TopWrapper>
      <FigureWrapper>
        <ThoughtSVG drawDelay={drawDelay} resizeDelta={resizeDelta} />
        <ScribbleFigure drawDelay={drawDelay} resizeDelta={resizeDelta} />
      </FigureWrapper>

      <HelperWrapper className="helperWrapper" $mobileTest={mobileTest}>
        <MouseIcon
          ref={mouseIcon}
          height={arrowHeight}
          width={arrowWidth}
          viewBox="0 0 37 35"
        >
          <path
            stroke="#c8c8c8"
            strokeWidth="2"
            fill="none"
            d="M17.5,34.75A12.9,12.9,0,0,1,4.61,21.86V13.14a12.89,12.89,0,0,1,25.78,0v8.72A12.9,12.9,0,0,1,17.5,34.75Zm0-32"
          />
          <path
            fill="#c8c8c8"
            d="M17.5,15.844a1.25,1.25,0,0,1-1.25-1.25V8.376a1.25,1.25,0,0,1,2.5,0v6.218A1.25,1.25,0,0,1,17.5,15.844Z"
          />
        </MouseIcon>
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

const HelperWrapper = styled.div<{ $mobileTest: boolean }>`
  position: absolute;
  bottom: ${(props) => (props.$mobileTest ? "15%" : "9%")};
  right: 15%;
  width: 100%;
  display: flex;
  visibility: visible;
  justify-content: flex-end;
`;

const FigureWrapper = styled.div`
  position: absolute;
  height: 100vh;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
`;

const MouseIcon = styled.svg`
  opacity: 0;
`;

/**
 * OLD GUIDED PATH LINE WITH ARROW FOLLOWING LOGIC
 */

// gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);
// const path = useRef<gsap.core.Tween | null>(null);
// const mask = useRef<gsap.core.Tween | null>(null);
// const directionHelper = useRef(null);

// const strokeWidth = `${2.5}px`;
// const helperViewportWidth = 550;
// const helperViewportHeight = 550;
// const helperHeight = `${350 * layoutSwitch}px`;
// const helperWidth = `${350 * layoutSwitch}px`;
// const arrowHeight = `${30 * layoutSwitch}px`;
// const arrowWidth = `${30 * layoutSwitch}px`;
// const helperViewport = `-10 -10 ${helperViewportHeight} ${helperViewportWidth}`;

// Taking the maks path and apply it automaticly to the actual path!
// Since i drew the path from left to right i have to bend over backwards to get it animated from right to left..
// key idea is that 100% 100% means the the line drawing starts at the end and ends there, so nothing is drawn
// then we take that and animate it from 0 to 100, thus we go from end to start!
// mask.current = gsap.fromTo(
//   "#maskPath",
//   { drawSVG: "100% 100%" },
//   {
//     drawSVG: "5% 100%",
//     duration: 4.1,
//     repeat: 3,
//     repeatDelay: 4,
//     ease: "arrowEase1",
//     delay: (drawDelay / 1000) * 3,
//   }
// );

// path.current = gsap.to(arrow.current, {
//   onStart: () => {
//     gsap.set(arrow.current, { visibility: "visible", opacity: 1 });
//     gsap.set(directionHelper.current, { visibility: "visible" });
//   },
//   duration: 4,
//   delay: (drawDelay / 1000) * 3,
//   ease: "arrowEase1",
//   repeat: 3,
//   repeatDelay: 4,
//   motionPath: {
//     path: "#pathGroup",
//     align: "#pathGroup",
//     // autoRotate: 180,
//     alignOrigin: [0.5, 0.65],
//     start: 1.0,
//     end: 0,
//   },
// });

// if (bottomScroll) {
//   mask.current.kill();
//   path.current.kill();
// }
//     <DirectionHelper
//       height={helperHeight}
//       width={helperWidth}
//       viewBox={helperViewport}
//       ref={directionHelper}
//     >
//       <defs>
//         <mask id="helperMask" maskUnits="userSpaceOnUse">
//           <path
//             id="maskPath"
//             d="M 200 350 C 210 60, 260 10, 260 5 C 290 -40, 340 100, 350 495"
//             stroke="#fff"
//             fill="none"
//             strokeLinecap="round"
//             strokeWidth={strokeWidth}
//           />
//         </mask>
//       </defs>
//       <g mask="url(#helperMask)">
//         <path
//           id="pathGroup"
//           mask="url(#maskPath)"
//           // d="M 0 350 C 50 55, 110 330, 110 330 C 180 -60, 320 200, 320 295"
//           d="M 200 350 C 210 60, 260 10, 260 5 C 290 -40, 340 100, 350 495"
//           stroke="#e3e2e2"
//           strokeWidth={strokeWidth}
//           strokeDasharray="17"
//           fill="transparent"
//           markerStart="url(#arrow)"
//           className="directionHelper"
//           strokeLinejoin="round"
//           strokeLinecap="round"
//         />
//       </g>
//       {/* Just some helper points in case i need to work on the form again */}
//       {/* <circle cx={200} cy={350} r={3} fill="red" />
//       <circle cx={210} cy={60} r={3} fill="red" />
//       <circle cx={260} cy={10} r={3} fill="red" />
//       <circle cx={260} cy={5} r={3} fill="red" />
//       <circle cx={290} cy={0} r={3} fill="red" />
//       <circle cx={420} cy={395} r={3} fill="red" /> */}
//     </DirectionHelper>
