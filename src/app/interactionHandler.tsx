"use client"

import gsap from "gsap";
import { useRef } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { useThree } from "@react-three/fiber";
import { ThreeLineMethods } from "@/components/threeLine";

export default function InteractionHandler({ lineApiRef }: { lineApiRef: React.RefObject<ThreeLineMethods | null> }) {
    const { size, camera, gl } = useThree();
    // Use a ref to store the last known pointer position.
    const lastPointerPosition = useRef({ x: 0, y: 0 });

    useGSAP(() => {
        if (!lineApiRef.current) return;
        const canvas = gl.domElement;
        gsap.registerPlugin(Observer);

        // This is our single, corrected function to add a point to the line.
        // It takes viewport coordinates and correctly converts them to 3D world space.
        const addPointAt = (clientX: number, clientY: number) => {
            if (!lineApiRef.current) return;

            // --- THE FIX ---
            // 1. Calculate the pointer's position relative to the entire page/canvas.
            const pointerXOnCanvas = clientX;
            const pointerYOnCanvas = clientY + window.scrollY;

            // 2. Normalize these page-relative coordinates to the -1 to +1 range (NDC).
            const ndcX = (pointerXOnCanvas / size.width) * 2 - 1;
            const ndcY = -(pointerYOnCanvas / size.height) * 2 + 1;

            // 3. Unproject the 2D NDC coordinates into your 3D orthographic world.
            const vector = new THREE.Vector3(ndcX, ndcY, 0);
            vector.unproject(camera);
            lineApiRef.current.addPoint(vector);
        };

        const observer = Observer.create({
            target: window,
            type: "scroll, pointer, wheel", // We only need to listen to scroll and pointer events

            // onPointerMove handles mouse and touch movement
            onMove: (self) => {
                // Store the latest position
                const viewportHeight = size.height / 2;
                const lowestQuarter = viewportHeight - ((size.height / 2) / 4); // full viewport - 3 quarter
                // console.log(self.y, lowestQuarter);
                if(self.velocityY > 2000 && self.y > lowestQuarter){
                    console.log("high velocity!!!", self.velocityY, size.height / 2);
                }
                lastPointerPosition.current = { x: self.x, y: self.y };
                // Add a point at the new position
                addPointAt(self.x, self.y);
            },
            
            // onScroll handles mouse wheel and touch-drag scrolling
            onWheel: () => {
                // When scrolling, draw a point at the LAST known pointer position.
                // This creates the effect of the line continuing while the page moves.
                addPointAt(lastPointerPosition.current.x, lastPointerPosition.current.y);
            },
        });

        return () => {
            // Cleanup the observer when the component unmounts
            observer.kill();
        };
    }, [camera, size, lineApiRef, gl]);

    return null;
}