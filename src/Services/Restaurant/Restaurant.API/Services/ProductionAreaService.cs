using Microsoft.EntityFrameworkCore;
using Restaurant.API.Data;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class ProductionAreaService(RestaurantContext context) : IProductionAreaService
    {
        public async Task<ApiResponse> AddAsync(ProductionArea productionArea)
        {
            context.ProductionAreas.Add(productionArea);
            await context.SaveChangesAsync();
            return new ApiResponse { Code = "1", Message = "Registrado correctamente!" };
        }

        public async Task<ApiResponse> DeleteAsync(int userId, int id)
        {
            var productionArea = await context.ProductionAreas.FindAsync(id);
            if (productionArea == null)
            {
                return new ApiResponse { Code = "0", Message = "Floor not found" };
            }

            //var orderExists = await context.OrderItems
            //   .Join(context.Items,
            //         order => order.ItemId,
            //         item => item.Id,
            //         (order, item) => new { order, item })
            //   .Join(context.ProductionAreas,
            //         combined => combined.item.ProductionAreaId,
            //         productionArea => productionArea.Id,
            //         (combined, productionArea) => new { combined.order, productionArea })
            //  .AnyAsync(f => f.productionArea.Id == id);

            //if (!orderExists)
            //{
            context.Remove(productionArea);
            //}
            //else
            //{
            //    productionArea.Enabled = false;
            //    productionArea.Deleted = true;
            //    productionArea.UserId = userId;
            //    context.Update(productionArea);
            //}

            await context.SaveChangesAsync();
            return new ApiResponse { Code = "1", Message = "Eliminado correctamente!" };
        }

        public async Task<ApiResponse> GetAllAsync()
        {
            var productionAreas = await context.ProductionAreas.Where(x => x.Deleted == null).ToListAsync();
            return productionAreas.Count > 0
                ? new ApiResponse { Code = "1", Payload = productionAreas }
                : new ApiResponse { Code = "0", Message = "Not found!" };
        }

        public async Task<ApiResponse> GetByEstabAsync(int establecimientoId)
        {
            var productionAreas = await context.ProductionAreas.Where(x => x.Deleted == null && x.EstablecimientoId == establecimientoId).ToListAsync();
            return productionAreas.Count > 0
                ? new ApiResponse { Code = "1", Payload = productionAreas }
                : new ApiResponse { Code = "0", Message = "Not found!" };
        }

        public async Task<ApiResponse> UpdateAsync(int id, ProductionArea productionArea)
        {
            var productionAreaFound = await context.ProductionAreas.FindAsync(id);
            if (productionAreaFound == null)
            {
                return new ApiResponse { Code = "0", Message = "Floor not found" };
            }

            productionAreaFound.Code = productionArea.Code;
            productionAreaFound.Description = productionArea.Description;
            productionAreaFound.Enabled = productionArea.Enabled;
            productionAreaFound.UserId = productionArea.UserId;
            context.Update(productionAreaFound);
            await context.SaveChangesAsync();
            return new ApiResponse { Code = "1", Message = "Actualizado correctamente!" };
        }
    }
}
