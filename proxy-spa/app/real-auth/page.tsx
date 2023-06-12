'use client';

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RealAuth() {

  const searchParams = useSearchParams();
  const authorizationCode = searchParams.get("code") as string;
  const [result, setResult] = useState<string>("");

  const url = "https://sonesukedev.b2clogin.com/sonesukedev.onmicrosoft.com/b2c_1_signin/oauth2/v2.0/token";


  const onClickGetToken = async () => {
    const codeChallenge = localStorage.getItem("code_challenge") as string;
    
    const queryString = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: "b4d1358b-02cf-4110-96b9-13be57019f45",
      redirect_uri: "https://localhost/proxy-auth",
      scope: "openid",
      code: authorizationCode,
      code_verifier: codeChallenge
    });  

    console.log(url + "?" + queryString.toString());

    const response = await fetch(url  + "?" + queryString.toString());
    const tokens = await response.json();
    setResult(JSON.stringify(tokens));
    console.log(tokens);
  };

  const onClickRefreshToken = async () => {
    const codeChallenge = localStorage.getItem("code_challenge") as string;
    
    const queryString = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: "b4d1358b-02cf-4110-96b9-13be57019f45",
      redirect_uri: "https://localhost/proxy-auth",
      scope: "openid",
      refresh_token: JSON.parse(result).refresh_token,
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
