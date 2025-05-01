import { Oswald, Permanent_Marker } from "next/font/google";

const oswald300 = Oswald({
	weight: "300",
	variable: "--font-oswald",
	preload: false,
	subsets: ["latin"],
});

const oswald400 = Oswald({
	weight: "400",
	variable: "--font-oswald",
	preload: false,
	subsets: ["latin"],
});

const oswald500 = Oswald({
	weight: "500",
	variable: "--font-oswald",
	preload: false,
	subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
	weight: "400",
	variable: "--font-permanentMarker",
	preload: true,
	fallback: ["brush script mt"],
	subsets: ["latin"],
})

export { oswald300, oswald400, oswald500, permanentMarker }