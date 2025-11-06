"use client";

import gsap from "gsap";
import { useRef } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ThreeLineMethods } from "@/app/Three/threeLine";

export default function InteractionHandler({
  lineApiRef,
  drawDelay,
  bottomScroll,
}: {
  lineApiRef: React.RefObject<ThreeLineMethods | null>;
  drawDelay: number;
  bottomScroll: (arr) => void;
}) {
  const { size, camera, gl } = useThree();
  // Use a ref to store the last known pointer position.
  const lastPointerPosition = useRef({ x: 0, y: 0 });
  const currentHalf = useRef<"top" | "bottom">(null);
  const bouncyMovement = useRef(0); // das soll die zurúck gelegte Strecke sein bevor der richtige page scroll getriggered wurde. Diese Strecke muss ich auch wieder nach oben oder unten reseten
  const pageScrollGuard = useRef(false);
  const fullHeight = size.height;
  const viewportHeight = fullHeight / 2;

  useGSAP(() => {
    if (!lineApiRef.current) return;
    gsap.registerPlugin(
      Observer,
      ScrollToPlugin,
      ScrollTrigger,
      ScrollSmoother
    );

    // This is our function to add a point to the line.
    // It takes viewport coordinates and correctly converts them to 3D world space.
    const addPointAt = (clientX: number, clientY: number) => {
      if (!lineApiRef.current) return;

      const pointerXOnCanvas = clientX;
      const pointerYOnCanvas = clientY + smoother.scrollTop();

      const ndcX = (pointerXOnCanvas / size.width) * 2 - 1;
      const ndcY = -(pointerYOnCanvas / fullHeight) * 2 + 1;

      const vector = new THREE.Vector3(ndcX, ndcY, 0);
      vector.unproject(camera);
      lineApiRef.current.addPoint(vector);
    };

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: false,
      smoothTouch: 0.1,
    });

    // setTimeout(() => {
    Observer.create({
      target: window,
      type: "scroll, pointer, wheel, touch", // We only need to listen to scroll and pointer events
      // onPointerMove handles mouse and touch movement

      onChangeY: () => {
        // since scrollY is read from the top of the screen and not the bottom we just devide the overall hight and add some tolerance
        const scrollHight = (document.body.scrollHeight / 2) * 0.9;
        const currentScroll = window.scrollY;
        if (currentScroll >= scrollHight) {
          bottomScroll(true); // using this to detect if the user figured out how to scroll down, so we trigger the indication arrow helper if not
        }
      },

      onMove: (self) => {
        const currentPercLong = (100 / viewportHeight) * self.y; // cursor position in percent relative to viewport
        const currentPercent = Number(currentPercLong.toFixed(0));
        const topViewportY = smoother.scrollTop();
        const bottomViewportY = topViewportY + viewportHeight;
        const pushBackPointTop = viewportHeight + viewportHeight / 8 - 1; // CHANGE THE PUSHBACK POINT TO ADJUST BOUNCE
        const pushBackPointBottom = viewportHeight - viewportHeight / 8; // CHANGE THE PUSHBACK POINT TO ADJUST BOUNCE
        const breakPointCheck = bouncyMovement.current + viewportHeight; // this is the distance scrolled before any page scroll got triggered including the viewport height

        // console.table({
        //   bottomViewportY: smoother.scrollTop() + viewportHeight, // 1170.5
        //   pushBackpoint: pushBackPointTop, // 1167
        //   bouncyMovement: bouncyMovement.current, // 132.5 ???
        //   breakPointCheck: breakPointCheck, // 1170.3
        // });

        // if the user does not push hard enough the page "bounces" or scrolls back up and stays stuck at that half
        // Ideas to adapt for mobile screens:
        //  - use the same idea but on touch event
        //  - so scroll also disabled

        // Hier bleibe ich jedes mal stecken!!
        // if (
        //   currentPercent > 15 && // der Mauszeiger ist weiter als 15% des viewport
        //   currentPercent < 90 && // der Mauszeiger ist unter 90% des viewport
        //   breakPointCheck < pushBackPointTop
        //   // breakPointCheck ist zu erst die Höhe des Viewports
        //   // bouncyMovement.current ist Teil vom breakPointCheck und hier noch garnicht definiert, bzw. Null!!
        // ) {
        //   smoother.scrollTo(
        //     Math.min(pushBackPointTop, bouncyMovement.current),
        //     true
        //   );
        // }

        // BOTTOM BOUNCE
        // if (
        //   currentHalf.current === "bottom" &&
        //   !pageScrollGuard.current &&
        //   currentPercent > 15 &&
        //   topViewportY > pushBackPointBottom
        // ) {
        //   bouncyMovement.current = Math.max(
        //     0,
        //     Math.max(
        //       pushBackPointBottom,
        //       self.y + viewportHeight - viewportHeight / 4.5
        //     )
        //   );

        //   // when the viewport is in a low position below the pushback value, we are alowed to scroll up
        //   if (
        //     currentPercent > 15 &&
        //     topViewportY > pushBackPointBottom // this scroll will occure most cases
        //   ) {
        //     smoother.scrollTo(
        //       Math.max(pushBackPointBottom, bouncyMovement.current), // if the bounce is too small we go back to the breakpoint
        //       true
        //     );
        //   }

        //   // when the viewport is too high scrolled - we scroll down!
        //   if (
        //     currentPercent > 15 &&
        //     topViewportY <= pushBackPointBottom // this should be the exception - we are beyond the breakpoint
        //   ) {
        //     smoother.scrollTo(
        //       Math.max(pushBackPointBottom, bouncyMovement.current), // still picking the higher value to always come back to the bottom
        //       true
        //     );
        //   }
        // }

        // My top area guard
        if (
          (topViewportY === 0 && // we have to make sure this is precise so we are able to fire the page scroll but also not stack animations
            !pageScrollGuard.current) ||
          bottomViewportY < pushBackPointTop
        ) {
          // i have to first, make sure that the viewport is positioned at the very bottom or top so the animation wont trigger while we are scrolling down from the top pos
          currentHalf.current = "top";
        }

        if (currentHalf.current === "top") {
          /** */
          /* PAGE BOUNCE PART */
          /** */
          if (
            // first we have to check if there is any scroll effect ongoing and the mouse speed is low enough
            !pageScrollGuard.current &&
            self.velocityY < 2000 &&
            bottomViewportY < pushBackPointTop // this means the bottom of the viewport is higher than the designated push back point
          ) {
            // then im setting the amount we want to move based on the cursor position but reduce it a bit
            bouncyMovement.current = Math.max(
              0,
              Math.min(pushBackPointTop - 1, self.y / 2 - viewportHeight / 3) // dont want it to be negative or to be higher than our push back point
            );

            // as long as we are at the push back point or just have scrolled down + delta is negative -> we scroll up
            if (
              !pageScrollGuard.current &&
              bottomViewportY < pushBackPointTop
            ) {
              const distanceToPushBack =
                pushBackPointTop / bottomViewportY > 1
                  ? pushBackPointTop - bottomViewportY
                  : 0;

              smoother.scrollTo(
                Math.min(distanceToPushBack, bouncyMovement.current), // checking again that we are below the push back point....
                true
              );
            }
          }

          /** */
          /* PAGE SCROLL PART */
          /** */

          if (self.velocityY > 3000 && currentPercent > 90) {
            // if the mouse is speedy enough and the cursor position is in the lower half we can trigger the page scroll
            gsap.to(window, {
              duration: 4,
              ease: "power4.out",
              scrollTo: { y: "max" },
              onComplete: () => {
                pageScrollGuard.current = false;
                currentHalf.current = "bottom";
                bouncyMovement.current = viewportHeight; // means we scrolled down one full viewport height
              },
              onStart: () => {
                pageScrollGuard.current = true;
              },
            });
          }
        }

        // My BOTTOM area guard
        if (
          topViewportY > pushBackPointBottom && // reading the top side viewport scrollY against the bottom breakpoint -> has to be lower or else currenthalf ist top!!
          pageScrollGuard.current === false
        ) {
          // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
          currentHalf.current = "bottom";

          if (
            self.velocityY > 2900 &&
            currentHalf.current === "bottom" &&
            currentPercent < 15
          ) {
            pageScrollGuard.current = true;
            gsap.delayedCall(4.5, () => (pageScrollGuard.current = false));

            currentHalf.current = "top";
            bouncyMovement.current = 0;

            gsap.to(window, {
              duration: 4,
              ease: "power4.out",
              scrollTo: { y: 0 },
            });
          }
        }

        // this is part of my animation logic, don`t touch
        lastPointerPosition.current = { x: self.x, y: self.y };
        addPointAt(self.x, self.y);
      },

      // onScroll handles mouse wheel and touch-drag scrolling
      onWheel: () => {
        const viewportHeight = fullHeight / 2;
        // When scrolling, draw a point at the LAST known pointer position.
        // This creates the effect of the line continuing while the page moves.
        const { x, y } = lastPointerPosition.current;
        addPointAt(x, y);

        pageScrollGuard.current = true;
        gsap.delayedCall(2, () => {
          pageScrollGuard.current = false;
        });

        if (smoother.scrollTop() === 0) {
          currentHalf.current = "top";
        }

        if (smoother.scrollTop() === viewportHeight) {
          // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
          currentHalf.current = "bottom";
        }
      },
    });

    //TIMEOUT END
    // }, drawDelay + 2000);

    return () => {
      // Cleanup the observer when the component unmounts
      // observer.kill();
    };
  }, [camera, size, lineApiRef, gl]);

  return null;
}
