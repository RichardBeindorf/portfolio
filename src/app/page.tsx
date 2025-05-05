"use client";
import { permanentMarker } from "../styles/font";
import React, { useRef } from "react";
import ScribbleFigure from "@/components/scribbleFigure";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import ThreeLine from "@/components/threeLine";

type Vec2 = { x: number; y: number };

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

export default function Home() {
	const [_document, set_document] = React.useState(null);
	// const lastPos = useRef<number[] | null>(null);
	const lineData = useRef([0,0]);

	React.useEffect(() => {
		set_document(document);
		// points.push(1);
	}, []);

	const cursor: {x: number | null, y: number | null} = {
		x: null,
		y: null,
	};

	const points: number[] = [];

	const canvasHeight = 900;
	const canvasWidth = _document?.body.clientWidth;

	function mouseMove(e) {
		cursor.x = e.clientX;
		cursor.y = e.clientY +11;
		lineData.current.push(e.clientX, e.clientY + 11);
		console.log(lineData);
	}

	function touchHandler(e) {
		e.preventDefault();
		cursor.x = e.touches[0].clientX;
		cursor.y = e.touches[0].clientY;
	}

	return (
			<WelcomeMain
				onMouseMove={mouseMove}
				onTouchMove={touchHandler}
			>
				<IntroHeader style={permanentMarker.style} >I`m Richard <br/> a Creative Developer <br/> based in Hamburg</IntroHeader>
				<ScribbleFigure/>
				<Canvas>
					<ThreeLine points={lineData}/>
				</Canvas>
			</WelcomeMain>
	);
}