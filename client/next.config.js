/** @type {import('next').NextConfig} */
const nextConfig = {
    // We explicitly disable standalone output for Amplify to avoid EEXIST errors
    // Amplify handles the build artifacts itself
    output: undefined,
    // If you needed images from S3 later
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'coworkspace-uploads.s3.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
            },
        ],
    },
};

module.exports = nextConfig;
