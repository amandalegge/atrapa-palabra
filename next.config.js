/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'spanish_catch_phrase'

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // If deploying to a subdirectory (e.g., github.com/username/repo), uncomment:
  // basePath: isProd ? `/${repoName}` : '',
  // assetPrefix: isProd ? `/${repoName}` : '',
}

module.exports = nextConfig

