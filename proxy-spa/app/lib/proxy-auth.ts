/**
 * 認証を利用するアプリケーション用
 */
export class client {
  
  /**
   * トークンを取得する。
   * 
   * リフレッシュトークンからアクセストークンを取得する。
   * リフレッシュトークンがなければ認証する。
   * 
   * @returns アクセストークン
   */
  static async getTokenAndAuthenticate(): Promise<any> {
    return new Promise((resolve) => {
      window.open("./real-auth?getTokenAndAuthenticate=on", "_blank");

      function handleMessage(event: MessageEvent<any>) {
        if (event.data === "authenticated") {
          window.removeEventListener("message", handleMessage);
          resolve(client.getToken());
        }
      }

      window.addEventListener("message", (event: MessageEvent<any>) => {
        if (event.data === "authenticated") {
          window.removeEventListener("message", handleMessage);
          resolve(client.getToken());
        }
      });
    });
  }

  static getToken() {
    const jsonTokens = localStorage.getItem("proxy_auth_tokens");
    if (!jsonTokens) {
      return null;
    }
    const tokens = JSON.parse(jsonTokens);
    return tokens;
  }

  static accessToken(token: any) {
    return token.access_token;
  }

  static clearToken() {
    localStorage.removeItem("proxy_auth_tokens")
  }


  static handleClientAuthPage(searchParams: { [key: string]: any }) {
    const codeChallenge = searchParams.get("code_challenge") as string;
    const redirectUrl = searchParams.get("redirect_url") as string;
    const authorizationCode = searchParams.get("code") as string;
  
    // const url = "https://sonesukedev.b2clogin.com/sonesukedev.onmicrosoft.com/b2c_1_signin/oauth2/v2.0/authorize";
    const url = "https://seritestorg3.b2clogin.com/seritestorg3.onmicrosoft.com/B2C_1_signupsignin1/oauth2/v2.0/authorize";
  
    const queryString = new URLSearchParams({
      // client_id: "b4d1358b-02cf-4110-96b9-13be57019f45",
      client_id: "94f9aed1-3985-4982-8ea3-e5a189b3a57d",
      nonce: "defaultNonce",
      redirect_uri: `${window.location.origin}${window.location.pathname}`,
      scope: "openid",
      response_type: "code",
      prompt: "login",
      code_challenge_method: "plain",
      code_challenge: codeChallenge
    });
  
    const adb2cLoginUrl = url + "?" + queryString.toString();
  
    if (!!redirectUrl) {
      authenticate();
    }
  
    function authenticate() {
      localStorage.setItem("redirect_url", redirectUrl);
      window.location.href = adb2cLoginUrl;
    };
  
  
    if (!!authorizationCode) {
      redirectToRealAuth();
    }
  
    function redirectToRealAuth() {
      const redirectUrl = localStorage.getItem("redirect_url");
      window.location.href = redirectUrl + "?code=" + authorizationCode;
    };
  
  }
}






export function handleRealProxyAuth(params: { [key: string]: any }) {
  const authorizationCode = params.get("code") as string;

  const isGetTokenAndAuthenticate = params.get("getTokenAndAuthenticate") as string === "on";
  if (isGetTokenAndAuthenticate) {
    getTokenAndAuthenticate()
  }

  if (authorizationCode) {
    setTimeout(() => {
      fetchTokenAfterAuthenticate(authorizationCode);
    }, 0)
  }
}



function startAuthenticate() {
  setTimeout(() => {
    const codeChallenge = "MUugg7kY0qpeWz2pvl6P9CWZpYV_1EooTmKokZVGDsM";
    localStorage.setItem("code_challenge", codeChallenge);
    const queryString = new URLSearchParams({
      redirect_url: `${window.location.origin}${window.location.pathname}`,
      code_challenge: codeChallenge
    });
    window.location.href = "./proxy-auth?" + queryString.toString();
  }, 0);
}



const url = "https://seritestorg3.b2clogin.com/seritestorg3.onmicrosoft.com/B2C_1_signupsignin1/oauth2/v2.0/token";
const client_id = "94f9aed1-3985-4982-8ea3-e5a189b3a57d"
const client_secret = "RmO8Q~P1NuGzfhgeKQyL2HEVKDlWgQc1hxAbWaNy"
const host = () => process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://localhost"

async function fetchTokenAfterAuthenticate(authorizationCode: string) {
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
  const jsonTokens = JSON.stringify(tokens)
  localStorage.setItem("proxy_auth_tokens", jsonTokens);
  console.log(tokens);
  finishAuthenticate();
};

const finishAuthenticate = () => {
  window.opener.postMessage("authenticated", "*");
  window.close();
}


async function getTokenAndAuthenticate() {
  if (isRefreshTokenExists()) {
    const response = await getRefreshToken();
    if (response.ok) {
      finishAuthenticate();
      return
    }
  }
  startAuthenticate();
}

function refreshToken() {
  const jsonTokens = localStorage.getItem("proxy_auth_tokens");
  if (!jsonTokens) {
    return null;
  }
  return JSON.parse(jsonTokens)?.refresh_token;
}

function isRefreshTokenExists() {
  return !!refreshToken();
}



const getRefreshToken = async (): Promise<Response> => {

  const host = () => process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://localhost"
  const queryString = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: client_id,
    redirect_uri: `${host()}/proxy-auth`,
    scope: "openid offline_access",
    refresh_token: refreshToken(),
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
  localStorage.setItem("proxy_auth_tokens", JSON.stringify(tokens));
  console.log(tokens);
  return response
};





