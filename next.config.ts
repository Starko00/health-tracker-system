import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    staleTimes:{
      dynamic:30,
      static:150,
    }
  },
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname:"utfs.io"
      }
    ]
  }
};

export default nextConfig;
