import type { NextConfig } from "next";

const withTM = require('next-transpile-modules')(['three'])
module.exports = withTM()

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['three'],
};


export default nextConfig;
