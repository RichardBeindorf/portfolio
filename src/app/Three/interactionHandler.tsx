"use client";

import gsap from "gsap";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { PullVariants } from "../page";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ThreeLineMethods } from "@/app/Three/threeLine";

export default function InteractionHandler({
  lineApiRef,
  drawDelay,
  bottomScroll,
  pullDirection,
}: {
  lineApiRef: React.RefObject<ThreeLineMethods | null>;
  drawDelay: number;
  bottomScroll: React.Dispatch<React.SetStateAction<boolean>>;
  pullDirection: PullVariants;
}) {
  const { size, camera } = useThree();
  // Use a ref to store the last known pointer position.
  const lastPointerPosition = useRef({ x: 0, y: 0 });
  const currentHalf = useRef<"top" | "bottom">(null);
  const bouncyMovement = useRef(0); // das soll die zurúck gelegte Strecke sein bevor der richtige page scroll getriggered wurde.
  // Diese Strecke muss ich auch wieder nach oben oder unten reseten
  const currentDeviceType = useRef(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
      ? "Mobile"
      : "Desktop"
  );

  const pageScrollGuard = useRef(false);
  const fullHeight = size.height;
  const viewportHeight = fullHeight / 2;
  const smoother = useRef(null);

  const currentScreen = useRef(null);

  useEffect(() => {
    currentScreen.current = pullDirection;
  }, [pullDirection]);

  useGSAP(() => {
    if (!lineApiRef.current) return;
    gsap.registerPlugin(ScrollSmoother, ScrollToPlugin, ScrollTrigger);

    smoother.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: false,
      smoothTouch: 0.1,
      normalizeScroll: true,
      ignoreMobileResize: true,
      ease: "sine.out",
    });

    // This is our function to add a point to the line.
    // It takes viewport coordinates and correctly converts them to 3D world space.
    const addPointAt = (clientX: number, clientY: number) => {
      if (!lineApiRef.current) return;

      const pointerXOnCanvas = clientX;
      const pointerYOnCanvas = clientY + smoother.current.scrollTop();

      const ndcX = (pointerXOnCanvas / size.width) * 2 - 1;
      const ndcY = -(pointerYOnCanvas / fullHeight) * 2 + 1;

      const vector = new THREE.Vector3(ndcX, ndcY, 0);
      vector.unproject(camera);
      lineApiRef.current.addPoint(vector);
    };

    setTimeout(() => {
      ScrollTrigger.observe({
        target: window,
        type: "scroll, pointer", // We only need to listen to scroll and pointer events
        // tolerance: 1,
        onChangeY: () => {
          // since scrollY is read from the top of the screen and not the bottom we just devide the overall hight and add some tolerance
          const scrollHight = (document.body.scrollHeight / 2) * 0.9;
          const currentScroll = window.scrollY;
          if (currentScroll >= scrollHight) {
            bottomScroll(true); // using this to detect if the user figured out how to scroll down, so we trigger the indication arrow helper if not
          }
        },
        onMove: (self) => {
          if (
            currentScreen.current === "default" &&
            currentDeviceType.current === "Desktop"
          ) {
            const currentPercLong = (100 / viewportHeight) * self.y; // cursor position in percent relative to viewport
            const currentPercent = Number(currentPercLong.toFixed(0));
            const topViewportY = smoother.current.scrollTop();
            const bottomViewportY = topViewportY + viewportHeight;
            const pushBackPointTop = viewportHeight + viewportHeight / 8 - 1; // CHANGE THE PUSHBACK POINT TO ADJUST BOUNCE
            const pushBackPointBottom = viewportHeight - viewportHeight / 8; // CHANGE THE PUSHBACK POINT TO ADJUST BOUNCE

            // if the user does not push hard enough the page "bounces" or scrolls back up and stays stuck at that half

            // My top area guard
            if (
              (topViewportY === 0 && // we have to make sure this is precise so we are able to fire the page scroll but also not stack animations
                !pageScrollGuard.current) ||
              bottomViewportY < pushBackPointTop
            ) {
              // i have to first, make sure that the viewport is positioned at the very bottom or top so the animation wont trigger while we are scrolling down from the top pos
              currentHalf.current = "top";
            }

            if (currentHalf.current === "top" && !pageScrollGuard.current) {
              /** */
              /* TOP BOUNCE PART */
              /** */
              if (
                // first we have to check if there is any scroll effect ongoing and the mouse speed is low enough
                self.velocityY < 2000 &&
                bottomViewportY < pushBackPointTop // this means the bottom of the viewport is higher than the designated push back point
              ) {
                const distanceToPushBack =
                  pushBackPointTop / bottomViewportY > 1
                    ? pushBackPointTop - bottomViewportY
                    : 0;

                // then im setting the amount we want to move based on the cursor position but reduce it a bit
                bouncyMovement.current = Math.max(
                  0,
                  Math.min(
                    pushBackPointTop - 1,
                    self.y / 2 - viewportHeight / 3
                  ) // dont want it to be negative or to be higher than our push back point
                );

                smoother.current.scrollTo(
                  Math.min(distanceToPushBack, bouncyMovement.current), // checking again that we are below the push back point....
                  true
                );
              }

              /** */
              /* TOP SCROLL PART */
              /** */

              if (
                smoother.current &&
                self.velocityY > 5000 &&
                currentPercent > 90
              ) {
                // if the mouse is speedy enough and the cursor position is in the lower half we can trigger the page scroll
                smoother.current.scrollTo(fullHeight, true);
                pageScrollGuard.current = true;
                bouncyMovement.current = 0;
                setTimeout(() => {
                  pageScrollGuard.current = false;
                  currentHalf.current = "bottom";
                  bouncyMovement.current = viewportHeight; // means we scrolled down one full viewport height
                }, 700);
              }
            }

            // My BOTTOM area guard
            if (
              (bottomViewportY === fullHeight && !pageScrollGuard.current) || // bottom of window touching the bottom of the page
              topViewportY > pushBackPointBottom // top side of our window moved over the bottom break point
            ) {
              // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
              currentHalf.current = "bottom";
            }

            if (currentHalf.current === "bottom" && !pageScrollGuard.current) {
              /** */
              /* BOTTOM BOUNCE PART */
              /** */
              if (self.velocityY < 2000 && topViewportY > pushBackPointBottom) {
                if (currentPercent < 30) {
                  // This is the bounce on the top side, pushing us back in
                  const bouncyCalc = self.y / 2 + viewportHeight * 0.87;
                  bouncyMovement.current = Math.max(
                    pushBackPointBottom + 1,
                    bouncyCalc
                  );

                  smoother.current.scrollTo(bouncyMovement.current, true);
                }

                // this keeps the view at the bottom of the screen so everything is in view most of the time
                if (currentPercent >= 30) {
                  smoother.current.scrollTo(fullHeight, true);
                }
              }

              /** */
              /* BOTTOM SCROLL PART */
              /** */

              if (
                smoother.current &&
                self.velocityY < -4800 &&
                currentPercent < 10
              ) {
                smoother.current.scrollTo(0, true);

                pageScrollGuard.current = true;
                bouncyMovement.current = 0;

                setTimeout(() => {
                  pageScrollGuard.current = false;
                  currentHalf.current = "top";
                }, 700);
              }
            }
          }

          // this is part of my animation logic, don`t touch
          lastPointerPosition.current = { x: self.x, y: self.y };
          addPointAt(self.x, self.y);
        },

        // onScroll handles mouse wheel and touch-drag scrolling
        onWheel: () => {
          if (currentScreen.current === "default") {
            const viewportHeight = fullHeight / 2;
            // When scrolling, draw a point at the LAST known pointer position.
            // This creates the effect of the line continuing while the page moves.
            const { x, y } = lastPointerPosition.current;
            addPointAt(x, y);

            pageScrollGuard.current = true;
            gsap.delayedCall(2, () => {
              pageScrollGuard.current = false;
            });

            if (smoother.current.scrollTop() === 0) {
              currentHalf.current = "top";
            }

            if (smoother.current.scrollTop() === viewportHeight) {
              // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
              currentHalf.current = "bottom";
            }
          }
        },
      });

      //TIMEOUT END
    }, drawDelay + 2000);
  }, []);

  return null;
}
