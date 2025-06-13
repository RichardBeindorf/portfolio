"use client";

import React, { useRef, useMemo, useImperativeHandle } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import * as THREE from "three";

export interface ThreeLineMethods {
  addPoint: (point: THREE.Vector3) => void;
}

function ThreeLine({ lineApiRef }: { lineApiRef: React.RefObject<ThreeLineMethods | null> }) {
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
      color: "red",
      linewidth: 3, 
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

  useImperativeHandle(lineApiRef, () => ({
    addPoint: (point: THREE.Vector3) => {
      points.current.push(point);
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
      
      const wave = Math.cos(distToWave / 30 - state.clock.elapsedTime * 5) * 50 * Math.exp(-Math.abs(distToWave / 30));
      
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
  });

  return (
      <primitive object={line2Ref.current}/>
  );
}

export default ThreeLine;




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