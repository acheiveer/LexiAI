import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
        {protocol: 'https',
    hostname: process.env.SUPABASE_HOSTNAME as string}
    ]
}
};

export default nextConfig;
