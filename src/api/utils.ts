export async function request(method: string, url: string, data: Object = {}): Promise<any> {
  const options = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: method,
    body: JSON.stringify(data)
  };
  try {
    return await fetch(url, options)
  } catch(e) {
    return e;
  }
}

export function parseJson(json: string): any {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.log('Could not parse json:', json);
    return null;
  }
}