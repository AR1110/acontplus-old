import { Floor } from '@restaurant/domain/models/floor.model';
import { Table } from '@restaurant/domain/models/table.model';

export interface Room {
  floorId?: number;
  code: string;
  description: string;
  capacity: number;
  id: number;
  enabled: true;
  floor?: Floor;
  tables?: Table[];
}
