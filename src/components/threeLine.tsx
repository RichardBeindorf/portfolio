"use client"

import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import ThreeThoughts from "./threeThoughts";
import { LineSegments2 } from "three/examples/jsm/Addons.js";

type lineProps = { points: React.RefObject<number[][]> }
type coords = [number, number, number];
type Vector3 = [x: number, y: number, z: number][];
type Vector2 = [x: number, y: number][];

export default function ThreeLine({ points }: lineProps) {
    const { size, camera } = useThree();
    const thoughtPoints = ThreeThoughts(); // ← assuming this returns a valid coords[] array
    
    const lineRef = useRef<THREE.Line>(null!);
    const wavesRef = useRef<coords[]>([]);
  
    const [linePoints, setLinePoints] = useState<THREE.Vector3[]>([new THREE.Vector3(14,14,14)]);
  
    useFrame(() => {
      if (points.current && points.current.length >= 1) {
        const worldPoints = points.current.map(([x, y]) => {
          const newX = (x / size.width) * 2 - 1;
          const newY = -(y / size.height) * 2 + 1;
          return new THREE.Vector3(newX, newY, 0.5).unproject(camera);
        });
        setLinePoints(worldPoints);
      }
    });
  
    return (
        <>
      <Line
        points={linePoints}
        color="#F24150"
        lineWidth={2}
        dashed={false}
      />
        {/* <Line
          points={thoughtPoints}
          color="#F24150"
          lineWidth={2}
          dashed={false}
        /> */}
      </>
    );
  }
    
        // const wave = [
        //     [-241.0, 77, -650],
        //     [-234.04, 77, -650],
        //     [-227.08, 77, -650],
        //     [-220.12, 77, -650],
        //     [-213.16, 77, -650],
        //     [-206.2, 77, -650],
        //     [-199.24, 77, -650],
        //     [-192.28, 77, -650],
        //     [-185.32, 77, -650],
        //     [-178.36, 77, -650],
        //     [-171.4, 77, -650],
        //     [-164.44, 77, -650],
        //     [-157.48, 77, -650],
        //     [-150.52, 77, -650],
        //     [-143.56, 77, -650],
        //     [-136.6, 77, -650],
        //     [-129.64, 77, -650],
        //     [-122.68, 77, -650],
        //     [-115.72, 77, -650],
        //     [-108.76, 77, -650],
        //     [-101.8, 77, -650],
        //     [-94.84, 77, -650],
        //     [-87.88, 77, -650],
        //     [-80.92, 77, -650],
        //     [-73.96, 77, -650],
        //     [-67.0, 77, -650],
        //     [-60.04, 77, -650],
        //     [-53.08, 77, -650],
        //     [-46.12, 77, -650],
        //     [-39.16, 77, -650],
        //     [-32.2, 77, -650],
        //     [-25.24, 77, -650],
        //     [-18.28, 77, -650],
        //     [-11.32, 77, -650],
        //     [-4.36, 77, -650],
        //     [2.6, 77, -650],
        //     [9.56, 77, -650],
        //     [16.52, 77, -650],
        //     [23.48, 77, -650],
        //     [30.44, 77, -650],
        //     [37.4, 77, -650],
        //     [44.36, 77, -650],
        //     [51.32, 77, -650],
        //     [58.28, 77, -650],
        //     [65.24, 77, -650],
        //     [72.2, 77, -650],
        //     [79.16, 77, -650],
        //     [86.12, 77, -650],
        //     [93.08, 77, -650],
        //     [100.04, 77, -650],
        //     [107.0, 77, -650],
        //     [113.96, 77, -650],
        //     [120.92, 77, -650],
        //     [127.88, 77, -650],
        //     [134.84, 77, -650],
        //     [141.8, 77, -650],
        //     [148.76, 77, -650],
        //     [155.72, 77, -650],
        //     [162.68, 77, -650],
        //     [169.64, 77, -650],
        //     [176.6, 77, -650],
        //     [183.56, 77, -650],
        //     [190.52, 77, -650],
        //     [197.48, 77, -650],
        //     [204.44, 77, -650],
        //     [211.4, 77, -650],
        //     [218.36, 77, -650],
        //     [225.32, 77, -650],
        //     [232.28, 77, -650],
        //     [239.24, 77, -650],
        //     [246.2, 77, -650],
        //     [253.16, 77, -650],
        //     [260.12, 77, -650],
        //     [267.08, 77, -650],
        //     [274.04, 77, -650],
        //     [281.0, 77, -650],
        //     [287.96, 77, -650],
        //     [294.92, 77, -650],
        //     [301.88, 77, -650],
        //     [308.84, 77, -650],
        //     [315.8, 77, -650],
        //     [322.76, 77, -650],
        //     [329.72, 77, -650],
        //     [336.68, 77, -650],
        //     [343.64, 77, -650],
        //     [350.6, 77, -650],
        //     [357.56, 77, -650],
        //     [364.52, 77, -650],
        //     [371.48, 77, -650],
        //     [378.44, 77, -650],
        //     [385.4, 77, -650],
        //     [392.36, 77, -650],
        //     [399.32, 77, -650],
        //     [406.28, 77, -650],
        //     [413.24, 77, -650],
        //     [420.2, 77, -650],
        //     [427.16, 77, -650],
        //     [434.12, 77, -650],
        //     [441.0, 77, -650]
        //   ];
    
        // Test Wave // Working!
        // useEffect(()=>{
        //     const oldWave = wave.slice();
        //     const newWave = [];
        //     // useFrame((state, delta) => {
        //         // const now = Date.now();
        //     for(let i = 0; i < oldWave.length; i++){
        //         const xValue = oldWave[i][0];
        //         const yValue = oldWave[i][1];
        //         const newY = yValue + Math.sin(xValue / 100) * 120;
        //         const vector = new THREE.Vector3(xValue, newY, -650);
        //         newWave.push([vector.x, vector.y, oldWave[i][2]]);
        //     };
        //     if(newWave.length === oldWave.length){
        //             console.log("news");
        //             setWaves(newWave);
        //     };
        // },[])