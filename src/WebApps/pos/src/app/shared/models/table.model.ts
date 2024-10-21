export interface Table {
  id: number;
  capacity: number;
  numberTable: number;
  description: string;
  roomId: number;
  floorId: number;
  assigned: boolean | null;
}

export interface GroupedTable {
  id: number
  capacity: number
  numberTable: number
  description: string
  roomId: number
  floorId: number
  assigned: boolean
}

export interface TableOrderFilter extends Pick<Table, "id"|"numberTable"|"description"> {
  id: number
  numberTable:  number
  description: string
  floor: string
  roomDescription: string
}
