"use client"

import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import ThreeThoughts from "./threeThoughts";


type coords = [number, number, number];

export default function ThreeLine ({ points }: { points: number[][]}) {
    const { size, camera } = useThree();
    const [waves, setWaves] = useState(points);
    console.log(points);

    const worldPoints = useMemo(() => {
        if(points && points.length >= 1){
            return points.map(([x, y]) => {
              const newX = (x / size.width) * 2 - 1;
              const newY = -(y / size.height) * 2 + 1;
        
              const vector = new THREE.Vector3(newX, newY, 0.5).unproject(camera);
              return [vector.x, vector.y, vector.z] as coords;
            });
        }

    }, [points, size, camera]);

    const thoughtPoints = ThreeThoughts();

    const wave = [
        [-241.0, 77, -650],
        [-234.04, 77, -650],
        [-227.08, 77, -650],
        [-220.12, 77, -650],
        [-213.16, 77, -650],
        [-206.2, 77, -650],
        [-199.24, 77, -650],
        [-192.28, 77, -650],
        [-185.32, 77, -650],
        [-178.36, 77, -650],
        [-171.4, 77, -650],
        [-164.44, 77, -650],
        [-157.48, 77, -650],
        [-150.52, 77, -650],
        [-143.56, 77, -650],
        [-136.6, 77, -650],
        [-129.64, 77, -650],
        [-122.68, 77, -650],
        [-115.72, 77, -650],
        [-108.76, 77, -650],
        [-101.8, 77, -650],
        [-94.84, 77, -650],
        [-87.88, 77, -650],
        [-80.92, 77, -650],
        [-73.96, 77, -650],
        [-67.0, 77, -650],
        [-60.04, 77, -650],
        [-53.08, 77, -650],
        [-46.12, 77, -650],
        [-39.16, 77, -650],
        [-32.2, 77, -650],
        [-25.24, 77, -650],
        [-18.28, 77, -650],
        [-11.32, 77, -650],
        [-4.36, 77, -650],
        [2.6, 77, -650],
        [9.56, 77, -650],
        [16.52, 77, -650],
        [23.48, 77, -650],
        [30.44, 77, -650],
        [37.4, 77, -650],
        [44.36, 77, -650],
        [51.32, 77, -650],
        [58.28, 77, -650],
        [65.24, 77, -650],
        [72.2, 77, -650],
        [79.16, 77, -650],
        [86.12, 77, -650],
        [93.08, 77, -650],
        [100.04, 77, -650],
        [107.0, 77, -650],
        [113.96, 77, -650],
        [120.92, 77, -650],
        [127.88, 77, -650],
        [134.84, 77, -650],
        [141.8, 77, -650],
        [148.76, 77, -650],
        [155.72, 77, -650],
        [162.68, 77, -650],
        [169.64, 77, -650],
        [176.6, 77, -650],
        [183.56, 77, -650],
        [190.52, 77, -650],
        [197.48, 77, -650],
        [204.44, 77, -650],
        [211.4, 77, -650],
        [218.36, 77, -650],
        [225.32, 77, -650],
        [232.28, 77, -650],
        [239.24, 77, -650],
        [246.2, 77, -650],
        [253.16, 77, -650],
        [260.12, 77, -650],
        [267.08, 77, -650],
        [274.04, 77, -650],
        [281.0, 77, -650],
        [287.96, 77, -650],
        [294.92, 77, -650],
        [301.88, 77, -650],
        [308.84, 77, -650],
        [315.8, 77, -650],
        [322.76, 77, -650],
        [329.72, 77, -650],
        [336.68, 77, -650],
        [343.64, 77, -650],
        [350.6, 77, -650],
        [357.56, 77, -650],
        [364.52, 77, -650],
        [371.48, 77, -650],
        [378.44, 77, -650],
        [385.4, 77, -650],
        [392.36, 77, -650],
        [399.32, 77, -650],
        [406.28, 77, -650],
        [413.24, 77, -650],
        [420.2, 77, -650],
        [427.16, 77, -650],
        [434.12, 77, -650],
        [441.0, 77, -650]
      ];

      const oldWave = wave.slice();
      const newWave = []
    // useFrame((state, delta) => {
        // const now = Date.now();
        for(let i = 0; i < oldWave.length - 1; i++){
            const xValue = oldWave[i][0];
            const yValue = oldWave[i][1];
            const newY = yValue + Math.sin(xValue / 100) * 120;
            const vector = new THREE.Vector3(xValue, newY, -650);
            newWave.push([vector.x, vector.y, oldWave[i][2]]);
        };
        if(newWave.length === oldWave.length){
            setWaves(newWave);
        }
        // lineWave.current.geometry.dispose();
        // lineWave.current.geometry.setFromPoints(newWave);

        // console.log(lineWave.current);
    // });

    // Wann möchte ich die Welle triggern? - wenn die cursor Bewegung eine bestimmte Amplitude-Y erreicht hat
    // Abhängig vom Ausschlag ändere ich auch die Amplitude der Linie


    return <>
    <Line
    points={worldPoints}
    color="#F24150"
    lineWidth={2}
    dashed={false}
    />
    <Line
    points={thoughtPoints}
    color="#F24150"
    lineWidth={2}
    dashed={false}/>
    <Line
    points={waves}
    color="#1900ff"
    lineWidth={2}
    dashed={false}/>
    </>}