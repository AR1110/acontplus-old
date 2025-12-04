namespace Restaurant.Infrastructure.Persistence.Repositories;

public class ProductionAreaRepository(RestaurantContext context) : IProductionAreaRepository
{
    public async Task<SpResponse> AddAsync(ProductionArea productionArea)
    {
        context.ProductionAreas.Add(productionArea);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrado correctamente!" };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var productionArea = await context.ProductionAreas.FindAsync(id);
        if (productionArea == null) return new SpResponse { Code = "0", Message = "Floor not found" };

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
        //    productionArea.IsActive = false;
        //    productionArea.IsDeleted = true;
        //    productionArea.UserId = userId;
        //    context.Update(productionArea);
        //}

        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminado correctamente!" };
    }

    public async Task<SpResponse> GetAllAsync()
    {
        var productionAreas = await context.ProductionAreas.AsNoTracking().Where(x => !x.IsDeleted).ToListAsync();
        return productionAreas.Count > 0
            ? new SpResponse { Code = "1", Payload = productionAreas }
            : new SpResponse { Code = "0", Message = "Not found!" };
    }

    public async Task<SpResponse> GetByEstabAsync(int establecimientoId)
    {
        var productionAreas = await context.ProductionAreas
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.EstablishmentId == establecimientoId).ToListAsync();
        return productionAreas.Count > 0
            ? new SpResponse { Code = "1", Payload = productionAreas }
            : new SpResponse { Code = "0", Message = "Not found!" };
    }

    public async Task<SpResponse> UpdateAsync(int id, ProductionArea productionArea)
    {
        var productionAreaFound = await context.ProductionAreas.FindAsync(id);
        if (productionAreaFound == null) return new SpResponse { Code = "0", Message = "Floor not found" };

        productionAreaFound.Code = productionArea.Code;
        productionAreaFound.Description = productionArea.Description;
        productionAreaFound.IsActive = productionArea.IsActive;
        productionAreaFound.UpdatedByUserId = productionArea.UpdatedByUserId;
        context.Update(productionAreaFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado correctamente!" };
    }
}
