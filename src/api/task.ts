import { request } from "./utils";

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// TODO: make it a singleton

export class APIClient {
  private token: string = "";
  private tokenSelector: string = "";

  constructor() {
    this.token = localStorage.getItem("token") ?? "";
    this.tokenSelector = localStorage.getItem("tokenSelector") ?? "";
  }

  async singleUser(
    method: Method,
    userId: string,
    options?: any
  ): Promise<any> {
    const usersEndpoint = `/users/${userId}`;
    const url = process.env.REACT_APP_DOABLE_API + usersEndpoint;
    const res = await request(
      method,
      url,
      this.token,
      this.tokenSelector,
      options?.body
    );
    if (res instanceof Error) {
      throw new Error(
        JSON.stringify({ code: 500, msg: "Server error occured" })
      );
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify({ code: res.status, msg: json.msg }));
    }
    return json;
  }

  async tasks(method: Method, options?: any): Promise<any> {
    const tasksEndpoint = "/tasks";
    const url = process.env.REACT_APP_DOABLE_API + tasksEndpoint;
    const res = await request(
      method,
      url,
      this.token,
      this.tokenSelector,
      options?.body
    );
    if (res instanceof Error) {
      throw new Error(
        JSON.stringify({ code: 500, msg: "Server error occured" })
      );
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify({ code: res.status, msg: json.msg }));
    }
    return json;
  }

  async singleTask(
    method: Method,
    taskId: string,
    options?: any
  ): Promise<any> {
    const tasksEndpoint = `/tasks/${taskId}`;
    const url = process.env.REACT_APP_DOABLE_API + tasksEndpoint;
    const res = await request(
      method,
      url,
      this.token,
      this.tokenSelector,
      options?.body
    );
    if (res instanceof Error) {
      throw new Error(
        JSON.stringify({ code: 500, msg: "Server error occured" })
      );
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify({ code: res.status, msg: json.msg }));
    }
    return json;
  }
}
