import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
			},
			{
				protocol: "http",
				hostname: "*",
			},
		],
	},
	allowedDevOrigins: [
		"local-origin.dev",
		"*.local-origin.dev",
		"192.168.100.162",
	],
};

export default nextConfig;
