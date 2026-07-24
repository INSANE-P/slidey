import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 홈 디렉터리에도 pnpm-workspace.yaml이 있어서 Next가 루트를 잘못 잡아요.
  turbopack: { root: path.resolve(process.cwd()) },
};

export default nextConfig;
