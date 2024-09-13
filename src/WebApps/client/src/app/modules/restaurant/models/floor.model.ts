import { Room } from '@restaurant/models/room.model';

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
