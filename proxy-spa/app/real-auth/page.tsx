'use client';

import * as proxyAuth from "../lib/proxy-auth";
import { useSearchParams } from "next/navigation";


export default function RealAuth() {

  const searchParams = useSearchParams();
  proxyAuth.handleRealProxyAuth(searchParams);
  
  return (
    <main>
      Authenticating...
    </main>
  )
}
