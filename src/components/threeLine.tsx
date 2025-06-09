"use client"

// import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type lineProps = { points: React.RefObject<THREE.Vector3[]> }

export default function ThreeLine({ points }: lineProps) {
  // const { size, camera } = useThree();
  // const initialVectors = [new THREE.Vector3(2,2,2), new THREE.Vector3(3,3,3)];
  // const wavePointsRef = useRef<THREE.Vector3[]>([initialVectors[0], initialVectors[1]]);
  const lineRef = useRef<any>(null);
  const oldGeometry = useRef(new THREE.BufferGeometry());
  const waveDist = useRef(0);

  const maxPoints = 4000;

  const material = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "hotpink"})
    return mat
  }, [])

  const positions = useMemo(()=> {
    const pos = new Float32Array(maxPoints * 3);
    return pos
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setDrawRange(0, 0);
    return geom;
  }, []);

  const line = useMemo(() => new THREE.Line(geometry, material), []);
  lineRef.current = line;

  useFrame((state) => {
    if ( !points.current || points.current.length < 2) return;
    // Step 1: Convert screen coords to world space
    const worldPoints = points.current;

    // Step 2: Compute distances
    const distances = [0];
    for (let i = 1; i < points.current.length; i++) {
      distances.push(distances[i - 1] + worldPoints[i].distanceTo(worldPoints[i - 1]));
    }

    // Step 3: Apply animated wave
    waveDist.current += 2;
    const wavedPoints = worldPoints.map((p, i) => {
      const distToWave = distances[i] - waveDist.current;
      const wave = Math.cos(distToWave / 30 - state.clock.elapsedTime * 5) * 0.1 * Math.exp(-Math.abs(distToWave / 30));
      return p.clone().add(new THREE.Vector3(0, wave, 0));
    });

  
    const drawCount = wavedPoints.length;

    for (let i = 0; i < drawCount; i++) {
      positions[i * 3 + 0] = wavedPoints[i].x;
      positions[i * 3 + 1] = wavedPoints[i].y;
      positions[i * 3 + 2] = wavedPoints[i].z;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    geometry.setDrawRange(0, drawCount);


    //old
    // const newGeomety = new THREE.BufferGeometry().setFromPoints(wavedPoints);
    // const material = new THREE.LineBasicMaterial({ color: "hotpink" });
    // const line = new THREE.Line(newGeomety, material);
    // lineRef.current = line;
    // console.log(lineRef.current);
    // oldGeometry.current.dispose();
    // oldGeometry.current.attributes.position.needsUpdate = true;
  });

  // Grund warum ich die geometry direkt update, ist weil die Methode mit dem stateRendering nicht funktioniert und react state nicht schnell genug renderd, um mit  

  return (
      <primitive object={lineRef.current}/>
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