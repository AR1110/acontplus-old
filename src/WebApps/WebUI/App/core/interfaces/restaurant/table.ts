export interface Table {
   readonly id?: number;
   roomId: number;
   numberTable: number;
   description: string;
   capacity: number;
   enabled: boolean;
}