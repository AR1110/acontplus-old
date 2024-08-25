import { Floor } from '@restaurant/models/floor.model';

export interface Room {
  floorId?: number;
  code: string;
  description: string;
  capacity: number;
  id?: number;
  enabled: true;
  floor?: Floor;
}
