"use client"

import gsap from "gsap";
import { useRef } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { useThree } from "@react-three/fiber";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ThreeLineMethods } from "@/components/threeLine";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface scrollRefObj {
    velocity: number,
    yPos: number,
    lowestQuarter: number,
}

export default function InteractionHandler({ lineApiRef }: { lineApiRef: React.RefObject<ThreeLineMethods | null> }) {
    const { size, camera, gl } = useThree();
    // Use a ref to store the last known pointer position.
    const lastPointerPosition = useRef({ x: 0, y: 0 });
    const pointerDataRef = useRef<scrollRefObj>({velocity: 0, yPos: 0, lowestQuarter: 0});
    const currentHalf = useRef< "top" | "bottom" >(null);

    useGSAP(() => {
        if (!lineApiRef.current) return;
        gsap.registerPlugin(Observer, ScrollToPlugin, ScrollTrigger, ScrollSmoother);

        // This is our function to add a point to the line.
        // It takes viewport coordinates and correctly converts them to 3D world space.
        const addPointAt = (clientX: number, clientY: number) => {
            if (!lineApiRef.current) return;

            const pointerXOnCanvas = clientX;
            const pointerYOnCanvas = clientY + window.scrollY;

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
        })

        let isCooldown = false;

        const observer = Observer.create({
            target: window,
            type: "scroll, pointer, wheel, touch", // We only need to listen to scroll and pointer events
            // onPointerMove handles mouse and touch movement
            onMove: (self) => {
                // const eventFix = self.event as PointerEvent;
                // const pagePosition = eventFix.pageY;
                const viewportHeight = size.height / 2;
                const lowestQuarter = viewportHeight - (viewportHeight / 4); // full viewport - 1 quarter
                const currentPercLong = (100 / viewportHeight) * self.y; // Position in percent relative to viewport
                const currentPercent = Number(currentPercLong.toFixed(0));

                const currentPercScroll = (100 / viewportHeight) * self.y; // Position in percent relative to viewport
                const currentScrollPerc = Number(currentPercScroll.toFixed(0));
                const pushBackPoint = viewportHeight + viewportHeight / 8;
                const bottomScrollViewportPos = window.scrollY + viewportHeight;
                
                pointerDataRef.current = { velocity: self.velocityY, yPos: self.y, lowestQuarter: lowestQuarter };

                
                console.log((window.scrollY + viewportHeight), pushBackPoint)
                if( currentPercent > 25 && (window.scrollY + viewportHeight) < pushBackPoint ){
                    const scrollToPos = self.y / 2;
                    smoother.scrollTo(scrollToPos, true);
                }

                // i have to first, make sure that the viewport is positioned at the very bottom or top so the animation wont trigger while we are scrolling down from the top pos
                if (window.scrollY === 0 || window.scrollY < pushBackPoint){
                    currentHalf.current = "top";
                    
                    if( pointerDataRef.current.velocity > 2000 && currentHalf.current === "top" && currentPercent > 90 ){
                        console.log(currentPercent);
                        gsap.to(window, {
                            duration: 4,
                            ease: "power4.out",
                            scrollTo: { y: "max" },
                        });
                    }
                }
                if (window.scrollY === viewportHeight){
                    // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
                    currentHalf.current = "bottom";

                    if( pointerDataRef.current.velocity > 2000 && currentHalf.current === "bottom" && currentPercent < 10 ){
                        console.log(currentPercent);
                        gsap.to(window, {
                            duration: 4,
                            ease: "power4.out",
                            scrollTo: { y: 0 },
                        });
                    }
                };



                
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

                if (window.scrollY === 0){
                    currentHalf.current = "top";
                };

                if (window.scrollY === viewportHeight){ 
                    // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
                    currentHalf.current = "bottom";
                };
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
// if (window.scrollY === 0){
//     currentHalf.current = "top";
//     const upperTl = gsap.timeline();
//     // const bounceOutDistance = viewportHeight + (viewportHeight / 100) * 20; // 20 % of the viewport added to the bottom;
//     const bounceOutDistance = (viewportHeight / 100) * 20; // 20 % of the viewport added to the bottom;
//     console.log(self.velocityY);


//     // here we set a flag so the event doesnt not get fired too much

//     if( pointerDataRef.current.velocity > 2000 && currentHalf.current === "top" && currentPercent > 90 ){
//         console.log(currentPercent);
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
// if (window.scrollY === viewportHeight){
//     // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
//     currentHalf.current = "bottom";
//     const lowerTl = gsap.timeline();
//     const bounceInDistance = viewportHeight - (viewportHeight / 100) * 20; // 20 % of the viewport substracted of the top;

//     console.log(bounceInDistance);

//     if( pointerDataRef.current.velocity > 2000 && currentHalf.current === "bottom" && currentPercent < 10 ){
//         console.log(currentPercent);
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