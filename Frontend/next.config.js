/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["10.0.0.113"], // Allow cross-origin from this IP
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*", // Proxy to backend dev server
      },
    ];
  },
};

module.exports = nextConfig;
