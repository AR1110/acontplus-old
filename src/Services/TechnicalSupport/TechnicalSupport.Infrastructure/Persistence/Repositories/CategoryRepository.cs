namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class CategoryRepository(TechnicalSupportContext context, IAdoRepository adoRepository)
    : ICategoryRepository
{
    public async Task<SpResponse> AddAsync(Category category)
    {
        context.Categories.Add(category);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Guardada Exitosamente" };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var category = await context.Categories.FindAsync(id);
        if (category == null)
            // Handle case where category not found
            return new SpResponse { Code = "0", Message = "Categoría no encontrada" };

        category.MarkAsDeleted(userId);
        context.Update(category);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        if (!await context.Categories.AnyAsync()) return new SpResponse { Code = "0", Message = "No data" };

        var ds = await adoRepository.GetDataSetAsync("TechnicalSupport.Category_Get");
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "No data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }


    public async Task<SpResponse> UpdateAsync(int id, Category category)
    {
        var categoryFound = await context.Categories.FindAsync(id);
        if (categoryFound == null)
            // Handle case where category not found
            return new SpResponse { Code = "0", Message = "Categoría no encontrada" };

        categoryFound.CompanyId = category.CompanyId;
        categoryFound.Code = category.Code;
        categoryFound.IsActive = category.IsActive;
        categoryFound.Name = category.Name;
        categoryFound.UpdatedByUserId = category.UpdatedByUserId;
        context.Update(categoryFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizada Exitosamente" };
    }
}
