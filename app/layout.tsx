import "../styles/globals.css";
import React from "react";

export const metadata = {
	title: "AI Lesson Plan Generator",
	description: "Generate structured curriculum plans in seconds",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
