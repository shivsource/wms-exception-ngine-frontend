/**
 * Generic envelope shapes every wms-exception-engine-backend endpoint uses.
 * See src/middlewares/errorHandler.ts and every controller's res.json(...) call.
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  count?: number;
}

export interface ApiFailure {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
