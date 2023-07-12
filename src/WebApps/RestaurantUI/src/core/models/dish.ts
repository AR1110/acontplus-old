import { ProductionArea } from "./production-area";

export interface Dish {
   ProductId: number;
   CreatedAt: string;
   UpdatedAt: string;
   Enabled: boolean;
   DeletedAt: boolean;
   ProductionArea: ProductionArea;
}

export interface ApiDish {
   ProductId: number;
   CreatedAt: string;
   UpdatedAt: string;
   Enabled: boolean;
   DeletedAt: boolean;
   ProductionArea: ProductionArea;
 }
