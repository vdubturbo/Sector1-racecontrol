/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this project so a stray lockfile above it
  // (e.g. an orphan /Users/slovett/projects/package-lock.json) can't make
  // Next infer the wrong root and break module resolution.
  outputFileTracingRoot: __dirname, // webpack builder
  turbopack: { root: __dirname },   // turbopack builder
};

module.exports = nextConfig;
