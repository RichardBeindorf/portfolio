"use client";
import { permanentMarker } from "../styles/font"; 
import React, { useRef, useEffect } from "react";
import ScribbleFigure from "@/components/scribbleFigure"; 
import styled from "styled-components";
import { Canvas, useThree } from "@react-three/fiber";
import ThreeLine, { ThreeLineMethods } from "@/components/threeLine";
// import ThreeThoughts from "@/components/threeThoughts";
import * as THREE from "three";
import Link from "next/link";

const Title = styled.h1`
    position: absolute;
    top: 200px;
    left: 400px;
    color: #F24150;
    z-index: 100;
    text-align: center;
    pointer-events: none;
`;

const Work = styled(Title)`
    top: 800px;
    left: 200px;
`;

const Passion = styled(Title)`
    top: 1000px;
    left: 500px;
`;

const Story = styled(Title)`
    top: 1000px;
    left: 800px;
`;

const WelcomeMain = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw; 
    height: 100vh; 
    overflow: hidden; 
    background-color: #F2F1E9;
    pointer-events: none;
`;
const CanvasWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const TestLink = styled(Link)`
    position: relative;
    z-index: 10000;
`;

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
    // const isDrawing = useRef(false); 

    useEffect(() => {
        const canvas = gl.domElement; 

        // const handleMouseDown = (e: MouseEvent) => { 
        //     isDrawing.current = true;
        //     if (lineApiRef.current) {
        //         const vector = new THREE.Vector3(
        //             (e.clientX / size.width) * 2 - 1, 
        //             -(e.clientY / size.height) * 2 + 1, 
        //             0
        //         );
        //         vector.unproject(camera);
        //         lineApiRef.current.addPoint(vector);
        //     }
        // };

        // const handleMouseUp = () => {
        //     isDrawing.current = false;
        // };

        const handleMouseMove = (e: MouseEvent) => {
            // if (!isDrawing.current || !lineApiRef.current) {
            //     return; 
            // }
            const newX = (e.clientX / size.width) * 2 - 1;
            const newY = -(e.clientY / size.height) * 2 + 1;

            const vector = new THREE.Vector3(newX, newY, 0);
            vector.unproject(camera);
            lineApiRef.current.addPoint(vector);
        };

        // canvas.addEventListener("mousedown", handleMouseDown);
        // canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);

        return () => {
            // canvas.removeEventListener("mousedown", handleMouseDown);
            // canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
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
            <ScribbleFigure />
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