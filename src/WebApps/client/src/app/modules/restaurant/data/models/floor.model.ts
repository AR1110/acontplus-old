import { Room } from '@restaurant/data/models/room.model';

export interface Floor {
  codEstab: string;
  establecimientoId: number;
  code: string;
  description: string;
  capacity: number;
  id: number;
  enabled: true;
  rooms?: Room[];
}

export interface FloorTreeNode {
  id: number;
  description: string;
  type: 'room' | 'floor' | 'table';
  capacity?: number;
  children?: FloorTreeNode[];
  expanded?: boolean;
  editing?: boolean;
  tempName?: string;
  tempCapacity?: number;
  roomId?: number;
  numberTable?: number;
  enabled?: boolean;
  roomName?: string;
  floorId?: number;
  code?: string;
}

export class GetFloorsByEstabIdResponse {
  floors: FloorTreeNode[] = [];
}
