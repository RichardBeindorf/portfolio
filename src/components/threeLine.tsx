import { Line, QuadraticBezierLine } from "@react-three/drei";
import { useEffect } from "react";

export default function ThreeLine (points: number[]) {

    // const startPoints = points

    useEffect(() => {

    }, [])

    return (
        <>
            <mesh>
                {/* <Line 
                    points={[[0,0],[2,2]]}
                    color={"black"}
                    lineWidth={2}
                    dashed={false} 
                /> */}
                <QuadraticBezierLine 
                    start={[1, 0, 0]}               // Starting point, can be an array or a vec3
                    end={[7, 1, 0]}               // Ending point, can be an array or a vec3
                    // mid={[5, 0, 1]}                 // Optional control point, can be an array or a vec3
                    color="#F24150"                   // Default
                    lineWidth={2}                   // In pixels (default)
                    dashed={false}     
                />
            </mesh>
        </>
    )
}