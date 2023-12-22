import type { Floor } from "./floor";

export interface Room {
   readonly id?: number;
   floorId: number;
   code: string;
   capacity: number;
   description: string;
   enabled: boolean;
   floor:  Floor;
}