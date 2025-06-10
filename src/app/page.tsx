"use client";
import { permanentMarker } from "../styles/font"; // Assuming this font import is correctly set up
import React, { useRef, useState, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import ScribbleFigure from "@/components/scribbleFigure"; // Assuming this component exists
import styled from "styled-components";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import * as THREE from "three"; // Corrected import syntax

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
    // Cast to OrthographicCamera for type safety, as useThree can return a PerspectiveCamera
    const orthoCamera = camera as THREE.OrthographicCamera;

    // Set the orthographic camera's frustum to exactly match the canvas dimensions.
    // This makes it a true 2D overlay camera.
    orthoCamera.left = -size.width / 2;
    orthoCamera.right = size.width / 2;
    orthoCamera.top = size.height / 2;
    orthoCamera.bottom = -size.height / 2;
    
    orthoCamera.near = 0.1; // Near clipping plane
    orthoCamera.far = 1000; // Far clipping plane, adjust if objects are deeper

    // Position the camera looking down the Z axis towards the origin (0,0,0)
    orthoCamera.position.set(0, 0, 100); 
    orthoCamera.lookAt(0, 0, 0); 
    
    // Crucial: Update the camera's projection matrix after changing its properties
    orthoCamera.updateProjectionMatrix();

    // Handle window resize to keep the camera frustum matched to the canvas size
    const handleResize = () => {
      orthoCamera.left = -size.width / 2;
      orthoCamera.right = size.width / 2;
      orthoCamera.top = size.height / 2;
      orthoCamera.bottom = -size.height / 2;
      orthoCamera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup: remove the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, size.width, size.height]); // Re-run effect if camera or size changes

  return null; // This component doesn't render anything
}

// Interface for the methods exposed by ThreeLine
interface ThreeLineMethods {
  addPoint: (point: THREE.Vector3) => void;
}

// ThreeLine component, now forwards its ref to expose methods
const ThreeLine = forwardRef<ThreeLineMethods, {}>((props, ref) => {
  // Get canvas size and gl context for LineMaterial resolution
  const { size } = useThree(); 
  
  // Ref to hold the Line2 object, which will be rendered as a primitive
  const line2Ref = useRef<Line2>(null);
  
  // Ref to store the actual 3D points
  // Initialized as an empty array, so the line starts empty
  const points = useRef<THREE.Vector3[]>([]); 
  
  // State for the wave animation offset
  const waveDist = useRef(0);

  // Maximum number of points the line can hold. Pre-allocate buffer based on this.
  // Adjust this value based on expected line length to prevent reallocations.
  const MAX_POINTS = 5000; 

  // Memoize the LineGeometry and LineMaterial to prevent unnecessary re-creations
  const line2Geometry = useMemo(() => {
    const geom = new LineGeometry();
    // Pre-allocate a large Float32Array for the position attribute.
    // This reduces reallocations during runtime when points are added.
    // LineGeometry will internally handle this buffer.
    geom.setPositions(new Float32Array(MAX_POINTS * 3)); // Initialize with a large buffer
    return geom;
  }, []);

  const line2Material = useMemo(() => {
    const mat = new LineMaterial({ 
      color: "hotpink", 
      linewidth: 5, // Width in pixels
      resolution: new THREE.Vector2(size.width, size.height), // Initial resolution
      dashed: false,
      alphaToCoverage: true, 
    });
    return mat;
  }, [size]);

  // Create the Line2 object once
  const line2 = useMemo(() => new Line2(line2Geometry, line2Material), [line2Geometry, line2Material]);
  line2Ref.current = line2;

  // Expose methods via useImperativeHandle
  useImperativeHandle(ref, () => ({
    addPoint: (point: THREE.Vector3) => {
      points.current.push(point);
      console.log("Point added: Total points:", points.current.length, "Coords:", point.x, point.y, point.z); 
    }
  }));

  // useFrame for continuous updates to the line geometry
  useFrame((state) => { 
    // Ensure there are enough points to draw a line
    if (points.current.length < 2) {
      // Hide the line if not enough points
      line2Geometry.setDrawRange(0, 0); 
      // If we have points but not enough to form a line, we can clear them to avoid tiny dots
      // if (points.current.length > 0) {
      //   points.current = [];
      // }
      return; 
    }

    const worldPoints = points.current;

    // Limit the number of points to MAX_POINTS to prevent buffer overflow if drawing continuously
    // This effectively makes it a "trailing" line if you draw more than MAX_POINTS
    const pointsToDraw = worldPoints.slice(Math.max(0, worldPoints.length - MAX_POINTS));


    // --- Re-enabled Wave Animation Logic ---
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
    // --- END Re-enabled Wave Animation Logic ---

    // **CRUCIAL FIX:** Use LineGeometry.setPositions to update the internal buffer.
    // This method is designed to correctly handle internal BufferAttribute updates
    // and resize its internal Float32Array if needed, though we pre-allocate.
    line2Geometry.setPositions(flatWavedPoints);
    
    // LineGeometry's setPositions should internally handle `needsUpdate` on its position attribute.
    // However, for robustness, we can ensure the draw range is set correctly.
    // The `count` property is implicitly managed by setPositions for LineGeometry.
    line2Geometry.setDrawRange(0, pointsToDraw.length); 

    // Compute line distances for Line2 to work correctly (needed for dashed lines etc.)
    line2.computeLineDistances(); 

    // Update bounding box and sphere for frustum culling
    line2Geometry.computeBoundingBox();
    line2Geometry.computeBoundingSphere();
    
    // Update the LineMaterial's resolution if the canvas size has changed
    if (line2Material.resolution.x !== size.width || line2Material.resolution.y !== size.height) {
      line2Material.resolution.set(size.width, size.height);
      line2Material.needsUpdate = true; // Mark material for update
    }
    console.log("ThreeLine useFrame: points.current.length", points.current.length, "FlatWavedPoints Length:", flatWavedPoints.length, "Buffer Length (internal):", (line2Geometry.attributes.position.array as Float32Array).length); 
  });

  // Render the Line2 object as a primitive
  return (
      <primitive object={line2Ref.current}/>
  );
});

// This component handles the mouse interaction and updates the points array of ThreeLine
function InteractionHandler({ lineRef }: { lineRef: React.RefObject<ThreeLineMethods> }) {
    const { size, camera, gl } = useThree(); // Get gl to access canvas DOM element
    const isDrawing = useRef(false); // To track if mouse button is pressed

    useEffect(() => {
        const canvas = gl.domElement; // Get the actual canvas DOM element

        const handleMouseDown = (e: MouseEvent) => { 
            isDrawing.current = true;
            console.log("Mouse Down: Drawing started.");
            // Add the first point immediately on mouse down to ensure it's captured
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
                return; // Only add points if drawing and lineRef is ready
            }

            // Normalize mouse coordinates to NDC (-1 to +1)
            const newX = (e.clientX / size.width) * 2 - 1;
            const newY = -(e.clientY / size.height) * 2 + 1;

            // Create a 3D vector. For orthographic camera, `z=0` (NDC) maps to the camera's near plane.
            const vector = new THREE.Vector3(newX, newY, 0);

            // Unproject the vector from screen space to world space
            vector.unproject(camera);

            // Imperatively add the new world point using the exposed method from ThreeLine
            lineRef.current.addPoint(vector);
        };

        // Attach event listeners to the canvas element
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);

        // Cleanup
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
        };
    }, [camera, size, lineRef, gl]); // Add gl to dependencies

    return null; // This component doesn't render anything visually itself
}

export default function Home() { 
    // Create a ref to get access to ThreeLine's exposed methods
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
