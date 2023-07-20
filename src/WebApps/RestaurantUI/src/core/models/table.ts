export interface ApiTable {
  Id: number;
  RoomId: number;
  NumberTable: number;
  Description: string;
  Capacity: number;
  CreatedAt: string;
  UpdatedAt: string;
  Enabled: boolean;
  Deleted: boolean;
}

export interface Table {
  readonly id: number;
  description: string;
  status: boolean;
}

export interface ItableApi {
  getAll(json: string): Promise<Table>;
}
