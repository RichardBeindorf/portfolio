"use client"

import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type LineProps = { points: React.RefObject<THREE.Vector3[]> }

export default function ThreeLine({ points }: LineProps) {
  // Get canvas size for LineMaterial resolution
  const { size } = useThree();
  
  // Ref to hold the Line2 object, which will be rendered as a primitive
  const line2Ref = useRef<Line2>(null);
  
  // State for the wave animation offset
  const waveDist = useRef(0);

  // Memoize the LineGeometry and LineMaterial to prevent unnecessary re-creations
  // The LineGeometry will be updated directly in the useFrame hook.
  const line2Geometry = useMemo(() => {
    // Start with an empty LineGeometry
    const geom = new LineGeometry();
    return geom;
  }, []); // Only create once

  const line2Material = useMemo(() => {
    // LineMaterial requires a resolution for correct rendering of line width
    const mat = new LineMaterial({ 
      color: "hotpink", 
      linewidth: 5, // Width in pixels
      resolution: new THREE.Vector2(size.width, size.height), // Set initial resolution
      dashed: false, // You can set this to true for dashed lines
      alphaToCoverage: true, // Recommended for better anti-aliasing with lines
    });
    return mat;
  }, [size]); // Recreate if canvas size changes

  // Create the Line2 object once. Its geometry and material will be updated later.
  const line2 = useMemo(() => new Line2(line2Geometry, line2Material), [line2Geometry, line2Material]);
  line2Ref.current = line2; // Assign to ref for rendering

  useFrame((state) => { 
    // Ensure points array exists.
    if (!points.current) {
      line2Geometry.setDrawRange(0, 0); // Hide the line if pointsRef is not ready
      return;
    }

    const worldPoints = points.current;

    // If there are less than 2 points, we cannot draw a line.
    // Set draw range to 0 and return without attempting to update positions.
    if (worldPoints.length < 2) {
      line2Geometry.setDrawRange(0, 0); 
      return; 
    }

    // --- Wave Animation Logic (unchanged from your original code) ---
    // Compute distances for wave animation
    const distances = [0];
    for (let i = 1; i < worldPoints.length; i++) {
      distances.push(distances[i - 1] + worldPoints[i].distanceTo(worldPoints[i - 1]));
    }

    // Apply animated wave
    waveDist.current += 2;
    const wavedPoints = worldPoints.map((p, i) => {
      const distToWave = distances[i] - waveDist.current;
      // The wave calculation depends on clock.elapsedTime for continuous animation
      const wave = Math.cos(distToWave / 30 - state.clock.elapsedTime * 5) * 0.5 * Math.exp(-Math.abs(distToWave / 30));
      return p.clone().add(new THREE.Vector3(0, wave, 0));
    });
    // --- End Wave Animation Logic ---

    // Prepare the points for LineGeometry
    // LineGeometry expects a flat array of numbers: [x1, y1, z1, x2, y2, z2, ...]
    const flatWavedPoints = wavedPoints.flatMap(p => p.toArray());

    // console.log(flatWavedPoints);

    // Update the positions in LineGeometry
    // This method efficiently updates the internal buffers of LineGeometry
    line2Geometry.setPositions(flatWavedPoints);
    
    // Explicitly set the draw range for the LineGeometry.
    // The 'count' argument for setDrawRange corresponds to the number of vertices to draw.
    // Since we now ensure wavedPoints.length >= 2 before this point, this is safe.
    line2Geometry.setDrawRange(0, wavedPoints.length);

    // Update bounding box and sphere after positions change.
    // This helps with frustum culling and ensures the object is rendered correctly.
    line2Geometry.computeBoundingBox();
    line2Geometry.computeBoundingSphere();
    
    // Update the LineMaterial's resolution if the canvas size has changed.
    // This is crucial for Line2's width to scale correctly on resize.
    if (line2Material.resolution.x !== size.width || line2Material.resolution.y !== size.height) {
      line2Material.resolution.set(size.width, size.height);
      // When resolution changes, the material needs to update its internal shaders
      // so explicitly mark it as needing an update.
      line2Material.needsUpdate = true;
    }
  });

  // Render the Line2 object as a primitive
  return (
      <primitive object={line2Ref.current}/>
  );
}




          // get the difference in height / velocity
        // const currentY = points.current[points.current.length - 1][1];
        // let pastY;
        // if(points.current.length - 5 && points.current[points.current.length - 5] && points.current[points.current.length - 5][1]){
        //   pastY = points.current[points.current.length - 5][1];
        // }
        // const percentNew = 100 / height * currentY; // higher === smaler value and lower === bigger value
        // const percentLast = 100 / height * pastY; 
        // const diff = Math.abs(percentNew - percentLast);


        // console.log(waveTrigger.current.length > 0, waveTrigger.current);
        // HERE I deduce the xValue every from in order to move the wave alone the line
        // if(waveTrigger.current.length > 0){
        //   waveTrigger.current = waveTrigger.current.map((wave, i, a)=> ({
        //     ...wave,
        //     xValue: wave.xValue - 1,
        //     }))
        //     console.log(waveTrigger.current[0].xValue);
        // }

        // If the cursor strikes high enough it will cause a wave!
        // When we trigger the wave we want to remember the point where we started
        // and then start counting down, traveling backwarts through the line
        // if ( diff > 3 ){
        //   // console.log("JUMP", points.current[points.current.length - 1]);

        //   if(points.current[points.current.length - 1])
        //   waveTrigger.current.push({ id: Number(state.clock.elapsedTime.toFixed(3)), xValue: points.current[points.current.length - 1][0]});
          
        //   // wavesRef.current = wavePoints;
        //   // console.log("WAVE", wavePoints,"WORLD", worldPoints);
        // };
        // if( diff < 3 ){
        //   // wavesRef.current = worldPoints;
        //   setLinePoints(worldPoints);
        // };