/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/me",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
