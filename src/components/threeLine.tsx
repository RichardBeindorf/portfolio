"use client"

import { Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";


type coords = [number, number, number];

export default function ThreeLine ({ points }: { points: number[][]}) {
    const { size, camera } = useThree();

    const worldPoints = useMemo(() => {
        if(points.length >= 1){
            return points.map(([x, y]) => {
              const newX = (x / size.width) * 2 - 1;
              const newY = -(y / size.height) * 2 + 1;
        
              const vector = new THREE.Vector3(newX, newY, 0.5).unproject(camera);
              return [vector.x, vector.y, vector.z] as coords;
            });
        }

}, [points, size, camera]);

    return <Line
    points={worldPoints}
    color="#F24150"
    lineWidth={2}
    dashed={false}     
    />
}