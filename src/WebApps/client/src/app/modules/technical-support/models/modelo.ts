
export interface Modelo {
  id: number;
  brandId: number;
  serieId?: number;
  code: string;
  name: string;
  year?: number;
  enabled?: boolean;
  brandName: string;
  categoryName: string;
}
