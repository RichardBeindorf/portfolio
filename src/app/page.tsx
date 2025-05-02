"use client";
import { permanentMarker, oswald300, oswald400, oswald500 } from "../styles/font";
import React, { RefObject, useRef } from "react";
import ScribbleFigure from "@/components/scribbleFigure";
import Canvas from "@/components/canvas";
import styled from "styled-components";



type Vec2 = { x: number; y: number };

const IntroHeader = styled.h1`
	position: absolute;
	top: 200px;
	left: 400px;
	z-index: 100;
	
	text-align: center;
`;

const WelcomeMain = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default function Home() {
	const [_document, set_document] = React.useState(null);
	const lastPos = useRef<number[] | null>(null);
	const lineData = useRef([{x:0, y:0}])

	React.useEffect(() => {
		set_document(document);
	}, []);

	const cursor: {x: number | null, y: number | null} = {
		x: null,
		y: null,
	};

	const canvasHeight = 900;
	const canvasWidth = _document?.body.clientWidth;

	class Line {
		newX: number;
		newY: number;
		lastX: number;
		lastY: number;
		lineTrailWidth: number;
		context: CanvasRenderingContext2D;
		cursor: Vec2;

		constructor(
			x: number,
			y: number,
			lineTrailWidth: number,
			context: CanvasRenderingContext2D,
			cursor: Vec2,
			lastPos: RefObject<number[]>,
		) {
			this.lastX = 400;
			this.lastY = 400;
			[this.lastX, this.lastY] = lastPos.current ?? [cursor.x, cursor.y];
			this.newX = x;
			this.newY = y;
			this.lineTrailWidth = lineTrailWidth;
			this.context = context;
			this.cursor = cursor;
		}
		update() {
				
				this.newX = this.cursor.x;
				this.newY = this.cursor.y;
	
				this.context.strokeStyle = "#F24150";
				this.context.lineCap = "round";
				// this.context.filter = "blur(0.5px)";
	
				this.context.beginPath();
				this.context.lineWidth = this.lineTrailWidth;
				this.context.moveTo(this.lastX, this.lastY); // verwirrend, aber moveTo bewegt nichts irgendwo hin, sondern heißt eher "hier fangen wir an"
				// and saving it to remember next time
				lastPos.current = [this.newX, this.newY];
	
				this.context.lineTo(this.newX, this.newY);
				this.context.stroke();
		}
	}

	function mouseMove(e) {
		cursor.x = e.clientX;
		cursor.y = e.clientY +11;
		lineData.current.push({x: e.clientX, y: (e.clientY + 11)});
		console.log(lineData);
	}

	function touchHandler(e) {
		e.preventDefault();
		cursor.x = e.touches[0].clientX;
		cursor.y = e.touches[0].clientY;
	}

	function draw(context: CanvasRenderingContext2D) {
		if(cursor.x && cursor.y){
			const particleOne = new Line(
				cursor.x,
				cursor.y,
				1.5,
				context,
				cursor,
				lastPos,
			);
			particleOne.update();
		}
	}

	return (
			<WelcomeMain
				onMouseMove={mouseMove}
				onTouchMove={touchHandler}
			>
				<IntroHeader style={permanentMarker.style} >I`m Richard <br/> a Creative Developer <br/> based in Hamburg</IntroHeader>
				<ScribbleFigure/>
				<Canvas
					id="cvs"
					height={canvasHeight}
					width={canvasWidth}
					draw={draw}
				/>
			</WelcomeMain>
	);
}