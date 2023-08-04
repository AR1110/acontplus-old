export interface ProductionAreaReadDto {
   readonly id: number;
   code: string;
   description: string;
   createdAt: string;
   updatedAt: string;
   enabled: boolean;
   deleted: boolean;
   userId: number;
 }