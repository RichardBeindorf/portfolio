"use client"

import { Line, QuadraticBezierLine } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";

type coords = [number, number, number];

export default function ThreeLine ({ points }: { points: number[][]}) {
    const { size, camera } = useThree();
    
    // const [drawLines, setDrawLines] = useState([]);

    // useEffect(() => {
        // for(let i = 0; i < points.length; i){
        //     if(points[i]){
        //         const startCoords: coords = [points[i][0], points[i][1], 0];
        //         const endCoords: coords = [points[i+1][0], points[i+1][1], 0];
            
        //     lines.current = (
        //     <QuadraticBezierLine 
        //         start={startCoords}               // Starting point, can be an array or a vec3
        //         end={endCoords}               // Ending point, can be an array or a vec3
        //         // mid={[5, 0, 1]}                 // Optional control point, can be an array or a vec3
        //         color="#F24150"                   // Default
        //         lineWidth={2}                   // In pixels (default)
        //         dashed={false}     
        //     />
        // )
        //     }
        // };
    // }, [points])
    
    const worldPoints = useMemo(() => {
    return points.map(([x, y]) => {
      const ndcX = (x / size.width) * 2 - 1;
      const ndcY = -(y / size.height) * 2 + 1;

      const vector = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
      return [vector.x, vector.y, vector.z] as coords;
    });
  }, [points, size, camera]);

    return <>
       { worldPoints.map((p,i,a)=>{
            const startCoord: coords= [p[0], p[1],0];
            let endCoord: coords;
    
            if(a[i+1]){
                endCoord = [a[i+1][0], a[i+1][1], 0];
            }
    
            if(endCoord !== undefined){
                // console.log("start and end coord", startCoord, endCoord);
                return <QuadraticBezierLine
                    key={i}
                    // points={[startCoord, endCoord]}
                    start={startCoord}               // Starting point, can be an array or a vec3
                    end={endCoord}               // Ending point, can be an array or a vec3
                    // mid={[5, 0, 1]}                 // Optional control point, can be an array or a vec3
                    color="#F24150"                   // Default
                    lineWidth={2}                   // In pixels (default)
                    dashed={false}     
                    />
            }})
            }
    </>
}