import { Brand } from './brand';

export interface Modelo extends Brand {
  id: number;
  brandId: number;
  serieId?: number;
  code: string;
  name: string;
  year?: number;
  enabled?: boolean;
}
