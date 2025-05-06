"use client";
import { permanentMarker } from "../styles/font";
import React, { useState } from "react";
import ScribbleFigure from "@/components/scribbleFigure";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import ThreeLine from "@/components/threeLine";

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
const CanvasLayer = styled(Canvas)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1000px;
    overflow: hidden;
`;

export default function Home() {
	// const [_document, set_document] = React.useState(null);
	// const lastPos = useRef<number[] | null>(null);
	const [lines, setLines] = useState<number[][]>([]);

	// React.useEffect(() => {
	// 	set_document(document);
	// }, []);

	const cursor: {x: number | null, y: number | null} = {
		x: null,
		y: null,
	};

	// const canvasHeight = 900;
	// const canvasWidth = _document?.body.clientWidth;

	function mouseMove(e) {
		cursor.x = e.clientX;
		cursor.y = e.clientY +11;
		setLines(prev => [...prev, [e.clientX, e.clientY + 11]]);
		console.log(lines);
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
				<CanvasLayer>
					<ThreeLine points={lines}/>
				</CanvasLayer>
			</WelcomeMain>
	);
}