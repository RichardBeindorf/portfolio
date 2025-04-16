"use client";

import Canvas from "./canvas";
import styles from "./page.module.css";

type Vec2 = { x: number; y: number };

export default function Home() {
	const cursor = {
		x: 50,
		y: 50,
	};
	class Particle {
		x: number;
		y: number;
		particleTrailWidth: number;
		strokeColor: string;
		theta = Math.random();
		t = Math.random() * 150;
		context: CanvasRenderingContext2D;
		cursor: Vec2;

		constructor(
			x: number,
			y: number,
			particleTrailWidth: number,
			strokeColor: string,
			context: CanvasRenderingContext2D,
			cursor: Vec2,
		) {
			this.x = x;
			this.y = y;
			this.particleTrailWidth = particleTrailWidth;
			this.strokeColor = strokeColor;
			this.theta = Math.random() * Math.PI * 2;
			// this.rotateSpeed = rotateSpeed;
			this.t = Math.random() * 150;
			this.context = context;
			this.cursor = cursor;
		}

		update() {
			const ls = { x: this.x, y: this.y };
			// this.x = this.cursor.x + Math.cos(this.theta) * this.t;
			// this.y = this.cursor.y + Math.sin(this.theta) * this.t;

			this.x = this.cursor.x - 1;
			this.y = this.cursor.y - 1;

			this.context.strokeStyle = this.strokeColor;

			this.context.beginPath();
			this.context.lineWidth = this.particleTrailWidth;
			this.context.moveTo(ls.x, ls.y);
			this.context.lineTo(this.x, this.y);
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

	// addEventListener("resize", () => setSize());
	// function setSize() {
	//   canvas.height = innerHeight;
	//   canvas.width = innerWidth;
	// }

	function draw(context: CanvasRenderingContext2D, count) {
		// context.clearRect(500, 500, context.canvas.width, context.canvas.height);
		context.fillStyle = "hotpink";

		const particleOne = new Particle(
			cursor.x,
			cursor.y,
			0.5,
			"#5e5e5e",
			context,
			cursor,
		);
		particleOne.update();
		const particleTwo = new Particle(
			cursor.x,
			cursor.y,
			0.5,
			"#5e5e5e",
			context,
			cursor,
		);
		particleTwo.update();

		// setTimeout(() => {
		// 	context.clearRect(2 + delta, 200, 3, 3);
		// }, 550);
	}

	return (
		<div
			className={styles.page}
			onMouseMove={mouseMove}
			onTouchMove={touchHandler}
		>
			<Canvas
				id="cvs"
				height={document.body.clientHeight}
				width={document.body.clientWidth}
				draw={draw}
			/>
		</div>
	);
}
