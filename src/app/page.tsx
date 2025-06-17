    "use client";
    import { permanentMarker } from "../styles/font"; 
    import React, { useRef, useEffect } from "react";
    import ScribbleFigure from "@/components/scribbleFigure"; 
    import styled from "styled-components";
    import { Canvas, useThree } from "@react-three/fiber";
    import ThreeLine, { ThreeLineMethods } from "@/components/threeLine";
    import * as THREE from "three";
    import { useGSAP } from "@gsap/react";
    import { Observer } from "gsap/Observer";
    import gsap from "gsap";

    const WelcomeMain = styled.main`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw; 
        height: calc(100vh * 2);
        background-color: #F2F1E9;
        /* pointer-events: none; */
    `;
    const CanvasWrapper = styled.div`
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100vh * 2);
    `;

    const StyledFigure = styled(ScribbleFigure)`
        position: sticky;
    `;

    const Title = styled.h1`
        position: fixed;
        top: 200px;
        left: 400px;
        color: #F24150;
        z-index: 100;
        text-align: center;
    `;

    const Work = styled(Title)`
        position: absolute;
        color: var(--foreground);
    `;

    const Passion = styled(Title)`
        position: absolute;
        color: var(--foreground);
    `;

    const Story = styled(Title)`
        position: absolute;
        color: var(--foreground);
    `;

    // const TestLink = styled(Link)`
    //     position: relative;
    //     z-index: 10000;
    // `;

    function CameraSetup() {
    const { camera, size } = useThree();

    useEffect(() => {
        const orthoCamera = camera as THREE.OrthographicCamera;
        orthoCamera.left = -size.width / 2;
        orthoCamera.right = size.width / 2;
        orthoCamera.top = size.height / 2;
        orthoCamera.bottom = -size.height / 2;
        orthoCamera.near = 0.1;
        orthoCamera.far = 1000;
        orthoCamera.position.set(0, 0, 100); 
        orthoCamera.lookAt(0, 0, 0);
        orthoCamera.updateProjectionMatrix();

        const handleResize = () => {
        orthoCamera.left = -size.width / 2;
        orthoCamera.right = size.width / 2;
        orthoCamera.top = size.height / 2;
        orthoCamera.bottom = -size.height / 2;
        orthoCamera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [camera, size.width, size.height]);

    return null; 
    }

function InteractionHandler({ lineApiRef }: { lineApiRef: React.RefObject<ThreeLineMethods | null> }) {
    const { size, camera, gl } = useThree();
    // Use a ref to store the last known pointer position.
    const lastPointerPosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
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

    export default function Home() { 
        const threeLineRef = useRef<ThreeLineMethods | null>(null);

        return (
            <WelcomeMain>
                <Title style={permanentMarker.style}>
                    Hi i`m Richard <br /> a Hamburg based <br /> &lt; Creative Developer /&gt;
                </Title>
                <StyledFigure />
                <CanvasWrapper>
                    <Canvas orthographic>
                        <CameraSetup />
                        <ThreeLine lineApiRef={threeLineRef} />
                        <InteractionHandler lineApiRef={threeLineRef} />
                    </Canvas>
                </CanvasWrapper>
                <Story> Story </Story>
                <Work> Work </Work>
                <Passion> Passion </Passion>
            </WelcomeMain>
        );
    }