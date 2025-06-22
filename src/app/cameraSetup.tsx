import * as THREE from "three";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function CameraSetup() {
    const { camera, size } = useThree();

    useEffect(() => {
        const orthoCamera = camera as THREE.OrthographicCamera;
        orthoCamera.left = -size.width / 2;
        orthoCamera.right = size.width / 2;
        orthoCamera.top = size.height / 2;
        orthoCamera.bottom = -size.height / 2;
        orthoCamera.near = 0.1;
        orthoCamera.far = 1000;
        orthoCamera.position.set(0, 0, 100); 
        orthoCamera.lookAt(0, 0, 0);
        orthoCamera.updateProjectionMatrix();

        const handleResize = () => {
        orthoCamera.left = -size.width / 2;
        orthoCamera.right = size.width / 2;
        orthoCamera.top = size.height / 2;
        orthoCamera.bottom = -size.height / 2;
        orthoCamera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [camera, size.width, size.height]);

    return null;
    }