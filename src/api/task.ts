import { request } from "./utils";

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export class APIClient {
  private token: string = "";
  private tokenSelector: string = "";

  constructor() {
    this.token = localStorage.getItem("token") ?? "";
    this.tokenSelector = localStorage.getItem("tokenSelector") ?? "";
  }

  async tasks(method: Method, options?: any): Promise<any> {
    const tasksEndpoint = "/tasks";
    const url = process.env.REACT_APP_DOABLE_API + tasksEndpoint;
    const res = await request(method, url, this.token, this.tokenSelector);
    if (res instanceof Error) {
      throw new Error("Server error occured");
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify({ code: res.status, msg: json.msg }));
    }
    return json;
  }
}
