"use client";

import React, { RefObject, useRef } from "react";
import Canvas from "./canvas";
import styles from "./page.module.css";

type Vec2 = { x: number; y: number };

export default function Home() {
	const [_document, set_document] = React.useState(null);
	const lastPos = useRef<number[]>([0, 0]);

	React.useEffect(() => {
		set_document(document);
	}, []);

	const cursor = {
		x: 50,
		y: 50,
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
			this.lastX = lastPos.current[0];
			this.lastY = lastPos.current[1];
			this.newX = x;
			this.newY = y;
			this.lineTrailWidth = lineTrailWidth;
			this.context = context;
			this.cursor = cursor;
		}
		update() {
			// const ls = { x: this.newX, y: this.newY };

			// hier stand noch (cursor.x) - 1, warum auch immer idk
			this.newX = this.cursor.x;
			this.newY = this.cursor.y;

			this.context.strokeStyle = "#f300c7d1";

			this.context.beginPath();
			// this.context.lineWidth = this.lineTrailWidth;
			this.context.moveTo(this.lastX, this.lastY); // verwirrend, aber moveTo bewegt nichts irgendwo hin, sondern heißt eher "hier fangen wir an"
			// and saving it to remember next time
			lastPos.current = [this.newX, this.newY];

			this.context.lineTo(this.newX, this.newY);
			this.context.stroke();
		}
	}

	function mouseMove(e) {
		cursor.x = e.clientX;
		cursor.y = e.clientY;
	}

	function touchHandler(e) {
		e.preventDefault();
		cursor.x = e.touches[0].clientX;
		cursor.y = e.touches[0].clientY;
	}

	function draw(context: CanvasRenderingContext2D) {
		const particleOne = new Line(
			cursor.x,
			cursor.y,
			0.3,
			context,
			cursor,
			lastPos,
		);
		particleOne.update();
	}

	return (
		<div
			className={styles.page}
			onMouseMove={mouseMove}
			onTouchMove={touchHandler}
		>
			<Canvas id="cvs" height={canvasHeight} width={canvasWidth} draw={draw} />
		</div>
	);
}
