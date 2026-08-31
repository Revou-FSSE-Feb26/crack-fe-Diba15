import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		qualities: [75, 85, 90, 95, 100],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.supabase.co",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
			{
				protocol: "https",
				hostname: "fastly.picsum.photos",
			},
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
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
