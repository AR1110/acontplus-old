export type TablesResponseFromApi = Array<{
  capacity: number;
  createdAt: string;
  deleted: boolean;
  description: string;
  enabled: boolean;
  floor: string;
  id: number;
  numberTable: number;
  roomId: number;
  table: string;
  updatedAt: string;
  userId: number;
}>;

export interface ITable {
  id: number;
  numberTable: number;
  description: string;
  capacity: number;
}
