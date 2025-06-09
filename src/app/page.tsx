"use client";
import { permanentMarker } from "../styles/font";
import React, { useRef, useState, useEffect } from "react";
import ScribbleFigure from "@/components/scribbleFigure";
import styled from "styled-components";
import { Canvas, useThree } from "@react-three/fiber";
import ThreeLine from "@/components/threeLine";
import * as THREE from "three";

const IntroHeader = styled.h1`
	position: absolute;
	top: 200px;
	left: 400px;
	z-index: 100;
	text-align: center;
`;

const WelcomeMain = styled.main`
	display: flex;
	justify-content: center;
	align-items: center;
`;
const CanvasWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

function InteractionHandler({ linesRef }: { linesRef: React.MutableRefObject<THREE.Vector3[]> }) {
	const { size, camera } = useThree();

	useEffect(() => {
		function handleMouseMove(e: MouseEvent) {
			const x = e.clientX;
			const y = e.clientY;
			const newX = (x / size.width) * 2 - 1;
			const newY = -(y / size.height) * 2 + 1;
			const vector = new THREE.Vector3(newX, newY, 0.5).unproject(camera);
			linesRef.current.push(vector);
		}

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [camera, size, linesRef]);

	return null;
}

export default function Home() {
	const lines = useRef<THREE.Vector3[]>([
		new THREE.Vector3(5, 5, -650),
		new THREE.Vector3(5, 5, -650),
	]);

	return (
		<WelcomeMain>
			<IntroHeader style={permanentMarker.style}>
				I`m Richard <br /> a Creative Developer <br /> based in Hamburg
			</IntroHeader>
			<ScribbleFigure />
			<CanvasWrapper>
				<Canvas orthographic camera={{ zoom: 1, position: [0, 0, 100] }}>
					<InteractionHandler linesRef={lines} />
					<ThreeLine points={lines} />
				</Canvas>
			</CanvasWrapper>
		</WelcomeMain>
	);
}
