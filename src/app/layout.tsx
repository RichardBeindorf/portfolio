import type { Metadata } from "next";
import "./styles/globals.css";



export const metadata: Metadata = {
	title: "RB Portfolio",
	description: "Richards digital buisness card",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.png" sizes="any" />
			</head>
			<body className={permanentMarker.cla}>
				{children}
			</body>
		</html>
	);
}
