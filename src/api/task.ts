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
    this.token = localStorage.getItem("token") || "";
    this.tokenSelector = localStorage.getItem("tokenSelector") || "";
  }

  async tasks(method: Method, options?: any): Promise<any> {
    const tasksEndpoint = "/tasks";
    // const url = process.env.REACT_APP_DOABLE_API + tasksEndpoint;
    const url = process.env.REACT_APP_DOABLE_LOCALHOST + tasksEndpoint;
    const res = (await request(
      method,
      url,
      this.token,
      this.tokenSelector
    )) as Response;
    if (res === null) {
      throw new Error("Server error occured");
    }
    try {
      const json = await res.json();
      if (res.status === 404) {
        throw new Error("Endpoint is gone");
      }
      return json;
    } catch (e) {
      throw new Error("Server error occured");
    }
  }
}
