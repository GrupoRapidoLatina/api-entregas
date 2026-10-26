export type ApiResponse<T = unknown> = {
  success: true;
  data?: T;
};
