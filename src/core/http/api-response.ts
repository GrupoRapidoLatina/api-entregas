import { ApiResponse } from './models/api-response.model';

export function ok(): ApiResponse;
export function ok<T>(data: T): ApiResponse<T>;
export function ok<T>(data?: T): ApiResponse<T> {
  return data === undefined ? { success: true } : { success: true, data };
}
