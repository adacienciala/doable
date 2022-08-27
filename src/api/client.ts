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

  private async handleRes(res: Response | Error): Promise<any> {
    if (res instanceof Error) {
      throw new Error(
        JSON.stringify({ code: 500, msg: "Server error occured" })
      );
    }
    if (res.status === 204) {
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify({ code: res.status, msg: json.msg }));
    }
    return json;
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
    return await this.handleRes(res);
  }

  async singleParty(
    method: Method,
    partyId: string,
    options?: any
  ): Promise<any> {
    const partiesEndpoint = `/parties/${partyId}`;
    const url = process.env.REACT_APP_DOABLE_API + partiesEndpoint;
    const res = await request(
      method,
      url,
      this.token,
      this.tokenSelector,
      options?.body
    );
    return await this.handleRes(res);
  }

  async parties(method: Method, options?: any): Promise<any> {
    const partiesEndpoint = "/parties";
    const url = process.env.REACT_APP_DOABLE_API + partiesEndpoint;
    const res = await request(
      method,
      url,
      this.token,
      this.tokenSelector,
      options?.body
    );
    return await this.handleRes(res);
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
    return await this.handleRes(res);
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
    return await this.handleRes(res);
  }

  async projects(method: Method, options?: any): Promise<any> {
    const projectsEndpoint = "/projects";
    const url = process.env.REACT_APP_DOABLE_API + projectsEndpoint;
    const res = await request(
      method,
      url,
      this.token,
      this.tokenSelector,
      options?.body
    );
    return await this.handleRes(res);
  }

  async singleProject(
    method: Method,
    projectId: string,
    options?: any
  ): Promise<any> {
    const projectsEndpoint = `/projects/${projectId}`;
    const url = process.env.REACT_APP_DOABLE_API + projectsEndpoint;
    const res = await request(
      method,
      url,
      this.token,
      this.tokenSelector,
      options?.body
    );
    return await this.handleRes(res);
  }
}
