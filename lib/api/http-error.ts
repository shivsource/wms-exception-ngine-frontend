/** Thrown by the API client for both transport failures and {success:false} backend responses. */
export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}
