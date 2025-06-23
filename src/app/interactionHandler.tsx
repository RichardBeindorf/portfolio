"use client"

import gsap from "gsap";
import { useRef } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { useThree } from "@react-three/fiber";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ThreeLineMethods } from "@/components/threeLine";

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
        gsap.registerPlugin(Observer);
        gsap.registerPlugin(ScrollToPlugin);

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

        const observer = Observer.create({
            target: window,
            type: "scroll, pointer, wheel", // We only need to listen to scroll and pointer events

            // onPointerMove handles mouse and touch movement
            onMove: (self) => {
                const viewportHeight = size.height / 2;
                const eventFix = self.event as PointerEvent;
                const lowestQuarter = viewportHeight - (viewportHeight / 4); // full viewport - 1 quarter
                const currentPercLong = (100 / viewportHeight) * self.y; // full viewport - 1 quarter
                const currentPercent = Number(currentPercLong.toFixed(0));
                const upperQuarter = size.height - (viewportHeight / 4) * 3;

                
                pointerDataRef.current = { velocity: self.velocityY, yPos: self.y, lowestQuarter: lowestQuarter };
                const pagePosition = eventFix.pageY;
                
                // below is the cursor y position on the overall page, not the viewport
                // console.log(size.height, size.height / 2,upperQuarter, self.y);
                
                // i have to first, make sure that the viewport is positioned at the very bottom so the animation wont trigger while we are scrolling down from the top pos
                if (window.scrollY === 0){
                    currentHalf.current = "top";
                    
                    if( pointerDataRef.current.velocity > 2000 && currentHalf.current === "top" && currentPercent > 90 ){
                        console.log(currentPercent);
                        // gsap.to(window, {
                        //     duration: 2,
                        //     scrollTo: 1000,
                        // });
                    }
                };
                
                if (window.scrollY === viewportHeight){
                    // when the viewport is positioned flush bottom, we are at the bottom half (scrollY take the top pixel value of the viewport)
                    currentHalf.current = "bottom";
                    
                    if( pointerDataRef.current.velocity > 2000 && currentHalf.current === "bottom" && currentPercent < 10 ){
                        console.log(currentPercent); 
                        
                        // gsap.to(window, {
                        //     duration: 2,
                        //     scrollTo: -900,
                        // });
                    };
                };


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