'use client';
import { useSearchParams } from "next/navigation";
import {client} from "../lib/proxy-auth"

export default function ProxyLogin() {

  const searchParams = useSearchParams();
  client.handleClientAuthPage(searchParams);

  return (
    <main>
      Authenticating...
    </main>
  )
}
