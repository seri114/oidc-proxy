'use client';
import { client } from "./lib/proxy-auth";
import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string>(client.getToken());

  const onClick = async () => {
    const tmpToken = await client.getTokenAndAuthenticate();
    setToken(tmpToken)
  };

  const onClickClear = () => {
    client.clearToken();
    setToken(client.getToken())
  }

  return (
    <main>
      <div><button onClick={onClick}>Enter Proxy Login</button></div>
      <div><button onClick={onClickClear}>Clear</button></div>
      {JSON.stringify(token)}
    </main>
  )
}
