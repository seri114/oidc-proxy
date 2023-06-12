'use client';
import { useSearchParams } from "next/navigation";


export default function ProxyAuth() {

  const searchParams = useSearchParams();
  const authorizationCode = searchParams.get("code") as string;
  

  const onClick = () => {
    const redirectUrl = localStorage.getItem ("redirect_url");
    window.location.href = redirectUrl + "?code=" + authorizationCode;
  };

  return (
    <main>
      <button onClick={onClick}>Redirect to Real Auth</button>
      <p>{authorizationCode}</p>
    </main>
  )
}
