/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone output for Docker support
    output: 'standalone',
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
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'api.qrserver.com',
            }
        ],
    },
};

module.exports = nextConfig;
