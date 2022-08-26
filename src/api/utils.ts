export async function request(
  method: string,
  url: string,
  token: string,
  tokenSelector: string,
  body?: any
): Promise<Response | Error> {
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}.${tokenSelector}`,
    },
    method,
    body: JSON.stringify(body),
  };
  try {
    return await fetch(url, options);
  } catch (e) {
    return e as Error;
  }
}

export function parseJson(json: string): any {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.log("Could not parse json:", json);
    return null;
  }
}
