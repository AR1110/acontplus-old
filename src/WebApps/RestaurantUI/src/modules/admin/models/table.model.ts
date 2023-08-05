export interface TableReadDto {
  id: number,
  roomId: number,
  numberTable: number,
  description: string,
  capacity: number,
  createdAt?: string,
  updatedAt?: string,
  enabled: boolean,
  deleted?: boolean,
  userId?: number,
  room?: string,
  floor?: string,
  idFloor?: number
}

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

export interface TableCreateDto {
  readonly id: number
  roomId: number,
  numberTable: number,
  description: string,
  capacity: number,
  enabled: boolean, 
}

export interface TableUpdateDto  {
  roomId: number,
  numberTable: number,
  description: string,
  capacity: number,
  enabled: boolean, 
}

 

export interface ITable {
  id: number;
  numberTable: number;
  description: string;
  capacity: number;
}
