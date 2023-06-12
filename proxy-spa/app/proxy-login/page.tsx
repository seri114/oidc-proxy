'use client';
import { useSearchParams } from "next/navigation";

export default function ProxyLogin() {

  const searchParams = useSearchParams();
  const codeChallenge = searchParams.get("code_challenge") as string;
  const redirectUrl = searchParams.get("redirect_url") as string;
  
  const url = "https://sonesukedev.b2clogin.com/sonesukedev.onmicrosoft.com/b2c_1_signin/oauth2/v2.0/authorize";
  
  const queryString = new URLSearchParams({
    client_id: "b4d1358b-02cf-4110-96b9-13be57019f45",
    nonce: "defaultNonce",
    redirect_uri: "https://localhost/proxy-auth",
    scope: "openid",
    response_type: "code",
    prompt: "login",
    code_challenge_method: "plain",
    code_challenge: codeChallenge
  });

  
  const adb2cLoginUrl = url + "?" + queryString.toString();
  console.log(adb2cLoginUrl);

  const onClick = () => {
    localStorage.setItem ("redirect_url", redirectUrl);
    alert(adb2cLoginUrl);
    window.location.href = adb2cLoginUrl;
  };

  return (
    <main>
      <button onClick={onClick}>ADB2C Login</button>

      <p>{codeChallenge}</p>
      <p>{redirectUrl}</p>
    </main>
  )
}
