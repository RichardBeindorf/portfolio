"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";

const Figure = styled.svg`
  position: absolute;
  opacity: 0;
  /* mix-blend-mode: color-burn; */
  z-index: 2;
`;

export default function ScribbleFigure({ drawDelay }: { drawDelay: number }) {
  const scribbleRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      scribbleRef.current.style.transition = "opacity 3s ease-in";
      scribbleRef.current.style.opacity = "1";
    }, drawDelay);
  }, []);

  return (
    <>
      <Figure
        ref={scribbleRef}
        width="117"
        height="161"
        viewBox="0 0 117 161"
        fill="none"
      >
        <g id="Figure">
          <path
            id="Vector 18"
            d="M24.9246 42.1266C23.8258 42.0167 22.8842 41.4506 21.8037 41.2844C18.4806 40.7732 13.4563 48.3775 11.7472 50.4491C1.66987 62.6641 18.2065 77.1437 28.5905 82.2533C46.153 90.8951 69.7688 92.9214 88.9292 90.2786C96.1432 89.2836 106.518 84.4208 108.15 76.259C109.625 68.8872 104.557 55.5215 98.9361 50.4491C88.1015 40.6716 73.1143 37.8323 59.3048 35.0425C53.6795 33.9061 -3.02441 21.4043 8.87395 41.2349"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            id="Vector 19"
            d="M54.3509 27.8596C54.1286 25.8585 50.2554 23.074 49.0998 21.7168C43.6404 15.3052 37.8903 9.71801 31.1666 4.67529"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            id="Vector 20"
            d="M56.1344 23.4009C56.7312 19.2233 57.2655 12.3302 60.692 9.43087C65.9161 5.0105 73.8797 3.80878 80.2104 2"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            id="Vector 21"
            d="M71.2933 29.6426C80.785 26.4787 91.5988 25.1841 101.611 25.1841"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            id="Vector 22"
            d="M58.8096 21.6173C62.1692 21.6173 65.2549 20.2452 68.4697 19.3385C77.3092 16.8453 86.3432 16.761 95.3694 18.0505"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            id="Vector 23"
            d="M18.3079 158.992C11.07 158.992 4.5236 152.445 2.70306 145.567C-1.33431 130.315 12.825 111.252 24.5498 103.36C30.7046 99.2172 36.2798 98.3023 43.4738 97.4647C51.2114 96.5637 60.0437 94.0387 67.847 94.9877C73.8163 95.7137 78.1918 102.653 82.9069 105.886C87.3289 108.919 92.2296 111.3 96.5797 114.407C101.256 117.747 101.542 127.168 103.515 132.241C104.808 135.565 107.123 137.306 108.816 140.316C111.115 144.404 115.504 149.789 115.504 154.534"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </Figure>
    </>
  );
}
