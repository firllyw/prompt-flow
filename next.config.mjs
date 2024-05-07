/** @type {import('next').NextConfig} */
const config = {
    rewrites: async () => {
        return [
            {
                source: '/anthropic/:path*',
                destination: 'https://api.anthropic.com/:path*',
            },
        ];
    },
};

export default config;
