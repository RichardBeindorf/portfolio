"use client";
import styled from "styled-components";

import { useEffect, useRef } from "react";
// import type { CanvasProps } from "react-html-props";

const Cvs = styled.canvas`
	z-index: 1;
`;

export default function Canvas(props: any) {	
	const { draw, ...rest } = props;
	const ref = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = ref.current;
		let animationID: number;
		if (canvas?.getContext) {
			const context = canvas?.getContext("2d");

			context.globalAlpha = 0.5; // wichtig, um den Überrest der Linie zu verdecken

			context.fillStyle = "transparent";
			context.fillRect(0, 0, canvas.width, canvas.height);

			function renderer() {
				draw(context);

				context.fillStyle = "rgb(255 255 255 / 15%)";
				context.fillRect(0, 0, canvas.width, canvas.height);

				animationID = window.requestAnimationFrame(renderer);
			}
			renderer();
		}
		return () => window.cancelAnimationFrame(animationID);
	}, [draw]);

	return <Cvs ref={ref} {...rest} />;
}
