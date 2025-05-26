namespace Contabilidad.API.Services;

public class SubcategoryService(ContabilidadContext context, IAdoRepository repository) : ISubcategoryService
{
    public async Task<ApiResponse> AddAsync(Subcategory subcategory)
    {
        if (await context.Subcategories.AnyAsync(x =>
                (x.CompanyId == subcategory.CompanyId) & (x.Code == subcategory.Code)))
            return new ApiResponse { Code = "0", Message = "Código ya existe" };

        context.Subcategories.Add(subcategory);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrada exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var subcategory = await context.Subcategories.FirstOrDefaultAsync(x => x.Id == id);
        if (subcategory == null) return new ApiResponse { Code = "0", Message = "Subcategoría no encontrada" };

        subcategory.IsActive = false;
        subcategory.IsDeleted = true;
        subcategory.UserId = userId;
        context.Update(subcategory);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Contabilidad.Subcategory_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true)) return new ApiResponse { Code = "0", Message = "Data not found" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Subcategory subcategory)
    {
        var subcategoryFound = await context.Subcategories.FindAsync(id);
        if (subcategoryFound == null) return new ApiResponse { Code = "0", Message = "Subcategoría no encontrada" };

        subcategoryFound.CategoryId = subcategory.CategoryId;
        subcategoryFound.Code = subcategory.Code;
        subcategoryFound.Name = subcategory.Name;
        subcategoryFound.IsActive = subcategory.IsActive;
        subcategoryFound.UserId = subcategory.UserId;
        context.Update(subcategoryFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizada exitosamente" };
    }
}