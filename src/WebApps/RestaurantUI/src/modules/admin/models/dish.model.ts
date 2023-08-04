import { ProductReadDto, ReadProductionAreaDto } from '.';


export interface ReadDishDto {
  readonly Id: number;
  Product: ProductReadDto;
  CreateAt: string;
  UpdateAt: string;
  Enabled: boolean;
  Deleted: boolean;
  ProductionArea: ReadProductionAreaDto;
  UserId: number;
}

export interface InsertDishDto {
   readonly Id: number;
   Product: ProductReadDto;
   CreateAt: string;
   UpdateAt: string;
   Enabled: boolean;
   Deleted: boolean;
   ProductionArea: ReadProductionAreaDto;
 }
