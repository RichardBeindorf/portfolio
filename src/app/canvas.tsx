"use client";

import { useEffect, useRef } from "react";
// import type { CanvasProps } from "react-html-props";

export default function Canvas(props: any) {
	const { draw, ...rest } = props;
	const ref = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = ref.current;
		let count = 0;
		let animationID: number;
		if (canvas?.getContext) {
			const context = canvas?.getContext("2d");
			context.strokeStyle = "#000"; // black stroke
			context.fillStyle = "#fff"; // white background fill
			context.fillRect(0, 0, canvas.width, canvas.height);

			function renderer() {
				count++;
				draw(context, count);
				animationID = window.requestAnimationFrame(renderer);
			}
			renderer();
		}
		return () => window.cancelAnimationFrame(animationID);
	}, [draw]);

	return <canvas ref={ref} {...rest} />;
}
