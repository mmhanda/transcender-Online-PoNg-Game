/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            { hostname: process?.env?.NEXT_PUBLIC_HOSTNAME },
            { hostname: 'cdn.intra.42.fr' },
            { hostname: 'lh3.googleusercontent.com'},
            { hostname: 'localhost' },
            { hostname: 'ui-avatars.com' },
        ],
    },
}
module.exports = nextConfig;
