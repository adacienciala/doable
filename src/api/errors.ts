export class ApiError {
  code: number;
  message: string;

  constructor(error: unknown) {
    const errObj = JSON.parse((error as Error).message);
    this.code = errObj.code;
    this.message = errObj.message;
  }
}
