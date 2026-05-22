/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint errors no bloquean el build de producción
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript errors tampoco bloquean
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
