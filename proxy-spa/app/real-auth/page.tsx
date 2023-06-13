'use client';

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RealAuth() {

  const searchParams = useSearchParams();
  const authorizationCode = searchParams.get("code") as string;
  const [result, setResult] = useState<string>("");

  const url = "https://seritestorg3.b2clogin.com/seritestorg3.onmicrosoft.com/B2C_1_signupsignin1/oauth2/v2.0/token";
  const client_id = "94f9aed1-3985-4982-8ea3-e5a189b3a57d"
  const client_secret = "RmO8Q~P1NuGzfhgeKQyL2HEVKDlWgQc1hxAbWaNy"
  const host = () => process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://localhost"

  const onClickGetToken = async () => {
    const codeChallenge = localStorage.getItem("code_challenge") as string;
    const queryString = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: client_id,
      redirect_uri: `${host()}/proxy-auth`,
      scope: "openid offline_access",
      code: authorizationCode,
      code_verifier: codeChallenge,
      client_secret: client_secret
    })

    console.log(url + "?" + queryString.toString());


    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: queryString // 本体のデータ型は "Content-Type" ヘッダーと一致させる必要があります
    })

    const tokens = await response.json();
    setResult(JSON.stringify(tokens));
    console.log(tokens);
  };

  const onClickRefreshToken = async () => {
    const codeChallenge = localStorage.getItem("code_challenge") as string;
    
    const host = () => process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://localhost"
    const queryString = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: client_id,
      redirect_uri: `${host()}/proxy-auth`,
      scope: "openid offline_access",
      refresh_token: JSON.parse(result).refresh_token,
      client_secret: client_secret
    });  

    console.log(url + "?" + queryString.toString());

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: queryString.toString(),
    });
    const tokens = await response.json();
    setResult(JSON.stringify(tokens));
    console.log(tokens);
  };
  
  return (
    <main>
      <button onClick={onClickGetToken}>Get Access Token</button>
      <button onClick={onClickRefreshToken}>RefreshToken</button>
      <p>{result}</p>
    </main>
  )
}
