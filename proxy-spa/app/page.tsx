'use client';

export default function Home() {
  const host = () => process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://localhost"
  const codeChallenge = "MUugg7kY0qpeWz2pvl6P9CWZpYV_1EooTmKokZVGDsM";
  const queryString = new URLSearchParams({
    redirect_url: `${host()}/real-auth`,
    code_challenge: codeChallenge
  });

  const onClick = () => {
    localStorage.setItem ("code_challenge", codeChallenge);
    window.location.href = "./proxy-login?" + queryString.toString();
  };

  return (
    <main>
      {process.env.NODE_ENV}
      <button onClick={onClick}>Enter Proxy Login</button>
    </main>
  )
}
