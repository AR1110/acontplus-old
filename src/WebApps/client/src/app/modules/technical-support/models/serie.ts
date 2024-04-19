import { Brand } from './brand';

export interface Serie extends Brand {
  id: number;
  code: string;
  name: string;
  enabled?: boolean;
}
