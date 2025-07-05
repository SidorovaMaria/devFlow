import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/context/Theme";
import { Toaster } from "sonner";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({
	variable: "--font-inter",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["system-ui", "sans-serif"],
});
const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
	title: "Dev Overflow",
	description:
		"Dev Overflow is a community-driven platform to ask and answer real-world programming questions. Learn, grow, and connect with developers around the world.",

	generator: "Next.js",
	applicationName: "Dev Overflow",
	referrer: "origin-when-cross-origin",

	keywords: [
		"Dev Overflow",
		"programming questions",
		"developer Q&A",
		"web development",
		"JavaScript",
		"React",
		"Node.js",
		"algorithms",
		"data structures",
		"developer community",
	],

	authors: [{ name: "Maria Sidorova" }],
	creator: "Maria Sidorova",
	publisher: "Dev Overflow",

	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},

	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	icons: {
		icon: "/images/site-logo.svg", // regular favicon
		shortcut: "/favicon.ico", // browser address bar icon
		apple: "/apple-touch-icon.png", // Apple devices
		other: [
			{
				rel: "mask-icon",
				url: "/safari-pinned-tab.svg",
				color: "#5bbad5",
			},
		],
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
				/>
			</head>
			<SessionProvider session={session}>
				<body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem={true}
						disableTransitionOnChange={true}
					>
						{children}
						<Toaster richColors />
					</ThemeProvider>
				</body>
			</SessionProvider>
		</html>
	);
}
