export class ApiResponse<T = unknown> {
  code: '0' | '1' | '2';
  message: string;
  payload: T | null;
  titleSms?: string;

  constructor() {
    this.code = '0';
    this.message = '';
    this.payload = null;
  }
}

export function isApiResponse(object: unknown | object): object is ApiResponse {
  if (object !== null && typeof object === 'object') {
    return 'code' in object;
  }
  return false;
}
