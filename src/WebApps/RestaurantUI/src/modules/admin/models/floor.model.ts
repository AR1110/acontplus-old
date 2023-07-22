export type FloorResponseFromApi = Array<{
  id: number;
  code: string;
  description: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  deleted: boolean;
  codEstab: string;
  userId: number;
}>;

export interface IFloor {
  id: number;
  code: number;
  description: string;
  capacity: number;
}
