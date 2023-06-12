'use client';

export default function Home() {
    
  const codeChallenge = "MUugg7kY0qpeWz2pvl6P9CWZpYV_1EooTmKokZVGDsM";
  const queryString = new URLSearchParams({
    redirect_url: "https://localhost/real-auth",
    code_challenge: codeChallenge
  });

  const onClick = () => {
    localStorage.setItem ("code_challenge", codeChallenge);
    window.location.href = "./proxy-login?" + queryString.toString();
  };

  return (
    <main>
      <button onClick={onClick}>Enter Proxy Login</button>
    </main>
  )
}
