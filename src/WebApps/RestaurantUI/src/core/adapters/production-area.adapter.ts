import { ApiProductionArea, ProductionArea } from "../models";

export const ApiDishAdapter = (production: ApiProductionArea): ProductionArea => ({
   Id: production.Id,
   Code: production.Code,
   Description: production.Description,
   CreatedAt: production.CreatedAt,
   UpdatedAt: production.UpdatedAt,
   Enabled: production.Enabled,
   DeletedAt: production.DeletedAt,
});