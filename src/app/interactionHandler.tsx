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
                const lowestQuarter = viewportHeight - ((size.height / 2) / 4); // full viewport - 3 quarter
                pointerDataRef.current = { velocity: self.velocityY, yPos: self.y, lowestQuarter: lowestQuarter };

                let currentHalf: "top" | "bottom";
                const eventFix = self.event as PointerEvent;
                console.log(eventFix.pageY);

                if(pointerDataRef.current.velocity > 2000 && pointerDataRef.current.yPos > lowestQuarter){
                    // console.log("high velocity!!!", self.velocityY, size.height / 2);
                
                    gsap.to(window, {
                        duration: 2,
                        scrollTo: 800,
                    });
                }

                lastPointerPosition.current = { x: self.x, y: self.y };
                addPointAt(self.x, self.y);
            },
            
            // onScroll handles mouse wheel and touch-drag scrolling
            onWheel: () => {
                // When scrolling, draw a point at the LAST known pointer position.
                // This creates the effect of the line continuing while the page moves.
                const { x, y } = lastPointerPosition.current;
                addPointAt(x, y);
            },
        });

        return () => {
            // Cleanup the observer when the component unmounts
            observer.kill();
        };
    }, [camera, size, lineApiRef, gl]);

    return null;
}