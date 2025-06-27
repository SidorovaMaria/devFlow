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
	title: "DevFlow",
	description:
		"A comunity-driven platform for asking and answering programming questions. Get help, share knowledge and collaborate with developers from around the world. Explore topics in web developemnt, mobile app development, algorithms, data structures and more. Become a part of the DevFlow community today!",
	icons: {
		icon: "/images/site-logo.svg",
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
