import { AxiosResponse } from 'axios';

export interface AxiosCall<T> {
  call: Promise<T>;
  controller?: AbortController;
}