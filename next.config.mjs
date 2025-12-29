/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/stitch/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/stitch/about",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/stitch/pricing",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/stitch/app",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/stitch/rights-map",
        destination: "/rights",
        permanent: true,
      },
      {
        source: "/stitch/profile-setup",
        destination: "/profile",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
