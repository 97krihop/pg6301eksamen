export const postJson = async (url: string, json: Object = {}) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json",
    },
  });
  checkResult(res, url);
  try {
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};
export const fetchJson = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, options);
  checkResult(res, url);
  return await res.json();
};

const checkResult = (res: Response, url: string) => {
  if (!res.ok) {
    throw new HttpException(res, url);
  }
};

export class HttpException extends Error {
  status: number;

  constructor(res: Response, url: string) {
    super(`Error while loading ${url}: ${res.status} ${res.statusText}`);
    this.status = res.status;
  }
}

export const randomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz1234567890";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return result;
};

export const sha256 = async (string: string) => {
  const binaryHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(string)
  );
  // @ts-ignore
  return btoa(String.fromCharCode.apply(null, new Uint8Array(binaryHash)))
    .split("=")[0]
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};
