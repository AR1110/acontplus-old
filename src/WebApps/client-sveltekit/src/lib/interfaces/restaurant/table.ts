import type { Room } from "./room";

export interface Table {
   readonly id?: number;
   roomId: number;
   numberTable: number;
   description: string;
   capacity: number;
   enabled: boolean;
   createdAt: string;
   room: Room;
}