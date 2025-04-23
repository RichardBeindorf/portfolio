"use client";
import styles from "./styles/canvas.module.css";
import { useEffect, useRef } from "react";
// import type { CanvasProps } from "react-html-props";

export default function Canvas(props: any) {
	const { draw, ...rest } = props;
	const ref = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = ref.current;
		let animationID: number;
		if (canvas?.getContext) {
			const context = canvas?.getContext("2d", { willReadFrequently: true });

			setTimeout(() => {
				const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
				console.log(imageData)
			}, 2000);

			// using the Image Date will be too complicated!

			// Ich sollte die Pfade der einzelnen Linien aufeichnen und dann mit meinen anpassungen nachzeichnen wenn ich etwas ändern möchte.
			//  points:[{x:10,y:10},{x:100,y:50},{x:30,y:200}]
			// Da ich es basieren auf Interaktion machen will und ein "Jiggle" Effekt durch die Linie wandern soll, glaube ich, dass ich viele NeuZeichnungen brauche
			// um den Jiggle jedes mal etwas weiter zu bewegen / animieren
			// jedoch muss an diesem Ort auch die Original line verdeckt werden, vielleicht indem ich die alte Linie in Background Farbe nachzeichne und dann den Jiggle drüberlege.

			// Path 2d könnte helfen
			// new Path2D();     // empty path object
			// new Path2D(path); // copy from another path
			// new Path2D(d);    // path from from SVG path data

			// https://gsap.com/docs/v3/Plugins/MotionPathPlugin/
			// hier muss ich es nichtmal in svg data umwandel, sondern kann auch points:[{x:10,y:10},{x:100,y:50},{x:30,y:200}] nehemen!
			// Dann den jiggle auf der linie entlang führen

			// context.globalAlpha = 0.5; // wichtig, um den Überrest der Linie zu verdecken

			context.fillStyle = "transparent";
			context.fillRect(0, 0, canvas.width, canvas.height);

			function renderer() {
				draw(context);
				// context.fillStyle = "rgb(255 255 255 / 15%)"; // brauche ich um die Linie ausfaden zu lassen
				// context.fillRect(0, 0, canvas.width, canvas.height);

				animationID = window.requestAnimationFrame(renderer);
			}
			renderer();
		}
		return () => window.cancelAnimationFrame(animationID);
	}, [draw]);

	return <canvas className={styles.canvass} ref={ref} {...rest} />;
}
