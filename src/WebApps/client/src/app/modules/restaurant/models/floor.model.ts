import { Room } from '@restaurant/models/room.model';

export interface Floor {
  codEstab: string;
  code: string;
  description: string;
  capacity: number;
  id: number;
  enabled: true;
  rooms?: Room[];
}
