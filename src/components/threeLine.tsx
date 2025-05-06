"use client"

import { QuadraticBezierLine } from "@react-three/drei";
import { useState } from "react";

type coords = [number, number, number];

export default function ThreeLine ({ points }: { points: number[][]}) {
    
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
    

    return <>
       { points.map((p,i,a)=>{
            const startCoord: coords= [p[0], p[1],0];
            let endCoord: coords;
    
            if(a[i+1]){
                endCoord = [a[i+1][0], a[i+1][1], 0];
            }
    
            if(endCoord !== undefined){
                console.log("start and end coord", startCoord, endCoord);
                return <QuadraticBezierLine
                    key={i}
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