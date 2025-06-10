"use client";
import { permanentMarker } from "../styles/font";
import React, { useRef, useState, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import ScribbleFigure from "@/components/scribbleFigure";
import styled from "styled-components";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import * as THREE from "three";

const IntroHeader = styled.h1`
    position: absolute;
    top: 200px;
    left: 400px;
    z-index: 100;
    text-align: center;
`;

const WelcomeMain = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw; /* Ensure main takes full viewport width */
    height: 100vh; /* Ensure main takes full viewport height */
    overflow: hidden; /* Prevent body scroll if content overflows */
`;
const CanvasWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

// Component to set up the orthographic camera properties
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

// Interface for the methods exposed by ThreeLine
interface ThreeLineMethods {
  addPoint: (point: THREE.Vector3) => void;
}

// ThreeLine component, now forwards its ref to expose methods
const ThreeLine = forwardRef<ThreeLineMethods, {}>((props, ref) => {
 
  const { size } = useThree(); 
  
 
  const line2Ref = useRef<Line2>(null);
  
 
 
  const points = useRef<THREE.Vector3[]>([]); 
  
 
  const waveDist = useRef(0);

 
 
  const MAX_POINTS = 5000; 

 
  const line2Geometry = useMemo(() => {
    const geom = new LineGeometry();
   
   
   
    geom.setPositions(new Float32Array(MAX_POINTS * 3));
    return geom;
  }, []);

  const line2Material = useMemo(() => {
    const mat = new LineMaterial({ 
      color: "hotpink", 
      linewidth: 5,
      resolution: new THREE.Vector2(size.width, size.height),
      dashed: false,
      alphaToCoverage: true,
      transparent: true,
      depthWrite: false,
     
     
    });
    return mat;
  }, [size]);

 
  const line2 = useMemo(() => new Line2(line2Geometry, line2Material), [line2Geometry, line2Material]);
  line2Ref.current = line2;

 
  useImperativeHandle(ref, () => ({
    addPoint: (point: THREE.Vector3) => {
      points.current.push(point);
      console.log("Point added: Total points:", points.current.length, "Coords:", point.x, point.y, point.z); 
    }
  }));

 
  useFrame((state) => { 
   
    if (points.current.length < 2) {
     
      line2Geometry.setDrawRange(0, 0); 
     
     
     
     
      return; 
    }

    const worldPoints = points.current;

   
   
    const pointsToDraw = worldPoints.slice(Math.max(0, worldPoints.length - MAX_POINTS));


   
    const distances = [0];
    for (let i = 1; i < pointsToDraw.length; i++) {
      distances.push(distances[i - 1] + pointsToDraw[i].distanceTo(pointsToDraw[i - 1]));
    }
    waveDist.current += 2;
    const wavedPoints = pointsToDraw.map((p, i) => {
      const distToWave = distances[i] - waveDist.current;
      const wave = Math.cos(distToWave / 30 - state.clock.elapsedTime * 5) * 0.5 * Math.exp(-Math.abs(distToWave / 30));
      return p.clone().add(new THREE.Vector3(0, wave, 0));
    });
    const flatWavedPoints = wavedPoints.flatMap(p => p.toArray());

    line2Geometry.setPositions(flatWavedPoints);
    line2Geometry.setDrawRange(0, pointsToDraw.length); 
    line2.computeLineDistances(); 
    line2Geometry.computeBoundingBox();
    line2Geometry.computeBoundingSphere();
    
   
    if (line2Material.resolution.x !== size.width || line2Material.resolution.y !== size.height) {
      line2Material.resolution.set(size.width, size.height);
      line2Material.needsUpdate = true;
    }
    console.log("ThreeLine useFrame: points.current.length", points.current.length, "FlatWavedPoints Length:", flatWavedPoints.length, "Buffer Length (internal):", (line2Geometry.attributes.position.array as Float32Array).length); 
  });

 
  return (
      <primitive object={line2Ref.current}/>
  );
});

// This component handles the mouse interaction and updates the points array of ThreeLine
function InteractionHandler({ lineRef }: { lineRef: React.RefObject<ThreeLineMethods> }) {
    const { size, camera, gl } = useThree();
    const isDrawing = useRef(false);

    useEffect(() => {
        const canvas = gl.domElement;

        const handleMouseDown = (e: MouseEvent) => { 
            isDrawing.current = true;
            console.log("Mouse Down: Drawing started.");
           
            if (lineRef.current) {
                const vector = new THREE.Vector3(
                    (e.clientX / size.width) * 2 - 1, 
                    -(e.clientY / size.height) * 2 + 1, 
                    0
                );
                vector.unproject(camera);
                lineRef.current.addPoint(vector);
            }
        };

        const handleMouseUp = () => {
            isDrawing.current = false;
            console.log("Mouse Up: Drawing stopped.");
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDrawing.current || !lineRef.current) {
                return;
            }

           
            const newX = (e.clientX / size.width) * 2 - 1;
            const newY = -(e.clientY / size.height) * 2 + 1;

           
            const vector = new THREE.Vector3(newX, newY, 0);

           
            vector.unproject(camera);

           
            lineRef.current.addPoint(vector);
        };

       
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);

       
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
        };
    }, [camera, size, lineRef, gl]);

    return null;
}

export default function Home() { 
   
    const threeLineRef = useRef<ThreeLineMethods>(null);

    return (
        <WelcomeMain>
            <IntroHeader style={permanentMarker.style}>
                I`m Richard <br /> a Creative Developer <br /> based in Hamburg
            </IntroHeader>
            <ScribbleFigure />
            <CanvasWrapper>
                <Canvas orthographic>
                    <CameraSetup />
                    {/* Pass the ref to ThreeLine */}
                    <ThreeLine ref={threeLineRef} />
                    {/* Pass the same ref to InteractionHandler */}
                    <InteractionHandler lineRef={threeLineRef} />
                </Canvas>
            </CanvasWrapper>
        </WelcomeMain>
    );
}


// "use client";
// import { permanentMarker } from "../styles/font";
// import React, { useRef, useState, useEffect } from "react";
// import ScribbleFigure from "@/components/scribbleFigure";
// import styled from "styled-components";
// import { Canvas, useThree } from "@react-three/fiber";
// import ThreeLine from "@/components/threeLine";
// import * as THREE from "three";

// const IntroHeader = styled.h1`
// 	position: absolute;
// 	top: 200px;
// 	left: 400px;
// 	z-index: 100;
// 	text-align: center;
// `;

// const WelcomeMain = styled.main`
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// `;
// const CanvasWrapper = styled.div`
// 	position: fixed;
// 	top: 0;
// 	left: 0;
// 	width: 100%;
// 	height: 100%;
// `;

// function InteractionHandler({ linesRef }: { linesRef: React.MutableRefObject<THREE.Vector3[]> }) {
// 	const { size, camera } = useThree();

// 	useEffect(() => {
// 		function handleMouseMove(e: MouseEvent) {
// 			const x = e.clientX;
// 			const y = e.clientY;
// 			const newX = (x / size.width) * 2 - 1;
// 			const newY = -(y / size.height) * 2 + 1;
// 			const vector = new THREE.Vector3(newX, newY, 0.5).unproject(camera);
// 			linesRef.current.push(vector);
// 		}

// 		window.addEventListener("mousemove", handleMouseMove);
// 		return () => window.removeEventListener("mousemove", handleMouseMove);
// 	}, [camera, size, linesRef]);

// 	return null;
// }

// export default function Home() {
// 	const lines = useRef<THREE.Vector3[]>([
// 		new THREE.Vector3(5, 5, -650),
// 		new THREE.Vector3(5, 5, -650),
// 	]);

// 	return (
// 		<WelcomeMain>
// 			<IntroHeader style={permanentMarker.style}>
// 				I`m Richard <br /> a Creative Developer <br /> based in Hamburg
// 			</IntroHeader>
// 			<ScribbleFigure />
// 			<CanvasWrapper>
// 				<Canvas orthographic camera={{ zoom: 1, position: [0, 0, 50] }}>
// 					<InteractionHandler linesRef={lines} />
// 					<ThreeLine points={lines} />
// 				</Canvas>
// 			</CanvasWrapper>
// 		</WelcomeMain>
// 	);
// }
