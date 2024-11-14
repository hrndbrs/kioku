export class FetchError extends Error {
  statusCode: number;
  constructor(e: any, statusCode: number) {
    super(e.detail);
    this.statusCode = statusCode;
  }
}
