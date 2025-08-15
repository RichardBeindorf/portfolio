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
import { ThreeLineMethods } from "@/components/threeLine";

export default function InteractionHandler({
  lineApiRef,
}: {
  lineApiRef: React.RefObject<ThreeLineMethods | null>;
}) {
  const { size, camera, gl } = useThree();
  // Use a ref to store the last known pointer position.
  const lastPointerPosition = useRef({ x: 0, y: 0 });
  const currentHalf = useRef<"top" | "bottom">(null);
  const bouncyMovement = useRef(0);
  const pageScrollGuard = useRef(false);

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
      const ndcY = -(pointerYOnCanvas / size.height) * 2 + 1;

      const vector = new THREE.Vector3(ndcX, ndcY, 0);
      vector.unproject(camera);
      lineApiRef.current.addPoint(vector);
    };

    let smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: false,
      smoothTouch: 0.1,
    });

    const observer = Observer.create({
      target: window,
      type: "scroll, pointer, wheel, touch", // We only need to listen to scroll and pointer events
      // onPointerMove handles mouse and touch movement
      onMove: (self) => {
        // const eventFix = self.event as PointerEvent;
        // const pagePosition = eventFix.pageY;
        const viewportHeight = size.height / 2;
        const currentPercLong = (100 / viewportHeight) * self.y; // Position in percent relative to viewport
        const currentPercent = Number(currentPercLong.toFixed(0));

        const pushBackPointTop = viewportHeight + viewportHeight / 8 - 1; // CHANGE THE PUSHBACK POINT TO ADJUST BOUNCE
        const pushBackPointBottom = viewportHeight - viewportHeight / 8; // CHANGE THE PUSHBACK POINT TO ADJUST BOUNCE
        const breakPointCheck = bouncyMovement.current + viewportHeight; // this is the Bottom of current scrolled position container

        // TOP BOUNCE
        if (
          // first we have to check if there is any scroll effect ongoing
          currentHalf.current === "top" &&
          !pageScrollGuard.current &&
          smoother.scrollTop() + viewportHeight < pushBackPointTop
        ) {
          //
          // then im setting the amount we want to move based on the cursor position but reduce it a bit
          bouncyMovement.current = Math.max(
            0,
            Math.min(pushBackPointTop, self.y / 2 - viewportHeight / 3) // dont want it to be negative or to be higher than our push back point
          );
          if (
            currentPercent > 15 &&
            currentPercent < 90 &&
            breakPointCheck < pushBackPointTop
          ) {
            smoother.scrollTo(
              Math.min(pushBackPointTop, bouncyMovement.current),
              true
            );
          }

          // as long as we are at the push back point or just have scrolled down + delta is negative -> we scroll up
          if (
            currentHalf.current === "top" &&
            !pageScrollGuard.current &&
            smoother.scrollTop() + viewportHeight < pushBackPointTop
          ) {
            smoother.scrollTo(
              Math.min(pushBackPointTop, bouncyMovement.current), // checking again that we are below the push back point....
              true
            );
          }
        }

        // BOTTOM BOUNCE
        if (
          currentHalf.current === "bottom" &&
          !pageScrollGuard.current &&
          currentPercent > 15 &&
          smoother.scrollTop() > pushBackPointBottom
        ) {
          bouncyMovement.current = Math.max(
            0,
            Math.max(
              pushBackPointBottom,
              self.y + viewportHeight - viewportHeight / 4.5
            )
          );

          // when the viewport is in a low position below the pushback value, we are alowed to scroll up
          if (
            currentPercent > 15 &&
            smoother.scrollTop() > pushBackPointBottom // this scroll will occure most cases
          ) {
            smoother.scrollTo(
              Math.max(pushBackPointBottom, bouncyMovement.current), // if the bounce is too small we go back to the breakpoint
              true
            );
          }

          // when the viewport is too high scrolled - we scroll down!
          if (
            currentPercent > 15 &&
            smoother.scrollTop() <= pushBackPointBottom // this should be the exception - we are beyond the breakpoint
          ) {
            smoother.scrollTo(
              Math.max(pushBackPointBottom, bouncyMovement.current), // still picking the higher value to always come back to the bottom
              true
            );
          }
        }

        /** */
        /* PAGE SCROLL PART */
        /** */

        // smoother.scrollTop() === 0 ||
        //   (breakPointCheck < pushBackPointTop && // we have to make sure this is precise so we are able to fire the page scroll but also not stack animations
        //     pageScrollGuard.current === false)

        // My top area guard
        if (
          (smoother.scrollTop() === 0 && // we have to make sure this is precise so we are able to fire the page scroll but also not stack animations
            pageScrollGuard.current === false) ||
          smoother.scrollTop() + viewportHeight < pushBackPointTop
        ) {
          // i have to first, make sure that the viewport is positioned at the very bottom or top so the animation wont trigger while we are scrolling down from the top pos
          currentHalf.current = "top";
          if (
            self.velocityY > 2000 &&
            currentHalf.current === "top" &&
            currentPercent > 90
          ) {
            // this helps me seperate the bouncy animation off the page transition
            pageScrollGuard.current = true;
            gsap.delayedCall(4.5, () => (pageScrollGuard.current = false));

            currentHalf.current = "bottom";
            bouncyMovement.current = viewportHeight;

            gsap.to(window, {
              duration: 4,
              ease: "power4.out",
              scrollTo: { y: "max" },
            });
          }
        }
        // My BOTTOM area guard
        if (
          smoother.scrollTop() > pushBackPointBottom && // reading the top side viewport scrollY against the bottom breakpoint -> has to be lower or else currenthalf ist top!!
          pageScrollGuard.current === false
        ) {
          // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
          currentHalf.current = "bottom";

          if (
            self.velocityY > 1900 &&
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
        const viewportHeight = size.height / 2;
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

    return () => {
      // Cleanup the observer when the component unmounts
      observer.kill();
    };
  }, [camera, size, lineApiRef, gl]);

  return null;
}

// old border scroll code:

// i have to first, make sure that the viewport is positioned at the very bottom so the animation wont trigger while we are scrolling down from the top pos
// if (smoother.scrollTop() === 0){
//     currentHalf.current = "top";
//     const upperTl = gsap.timeline();
//     // const bounceOutDistance = viewportHeight + (viewportHeight / 100) * 20; // 20 % of the viewport added to the bottom;
//     const bounceOutDistance = (viewportHeight / 100) * 20; // 20 % of the viewport added to the bottom;

//     // here we set a flag so the event doesnt not get fired too much

//     if( pointerDataRef.current.velocity > 2000 && currentHalf.current === "top" && currentPercent > 90 ){
//         gsap.to(window, {
//             duration: 4,
//             ease: "power4.out",
//             scrollTo: { y: "max" },
//         });
//     }

//     if( !isCooldown && pointerDataRef.current.velocity < 2000 && pointerDataRef.current.velocity > 900 && currentHalf.current === "top" && currentPercent > 45){
//         isCooldown = true;

//         upperTl.to(window, { duration: 0.5, scrollTo: ((bounceOutDistance / 2) + self.velocityY / 100), ease: "back.out"}).to(window, { duration: 0.5, scrollTo: 0, ease: "power4.out" })

//         gsap.delayedCall(3.5, () => {
//             isCooldown = false;
//         });
//     }
// }
// if (smoother.scrollTop() === viewportHeight){
//     // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
//     currentHalf.current = "bottom";
//     const lowerTl = gsap.timeline();
//     const bounceInDistance = viewportHeight - (viewportHeight / 100) * 20; // 20 % of the viewport substracted of the top;

//     if( pointerDataRef.current.velocity > 2000 && currentHalf.current === "bottom" && currentPercent < 10 ){
//         gsap.to(window, {
//             duration: 4,
//             ease: "power4.out",
//             scrollTo: { y: 0 },
//         });
//     };

//     if( !isCooldown && pointerDataRef.current.velocity < 2000 && pointerDataRef.current.velocity > 1300 && currentHalf.current === "bottom" && currentPercent < 45){
//         isCooldown = true;

//         lowerTl.to(window, { duration: 0.5, scrollTo: (bounceInDistance / 1 - self.velocityY / 100), ease: "back.out"}).to(window, { duration: 0.5, scrollTo: "max", ease: "power4.out" })

//         gsap.delayedCall(5, () => {
//             isCooldown = false;
//         });
//     }
// };
