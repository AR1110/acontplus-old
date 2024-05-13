namespace Contabilidad.API.Services;

public class CategoryService(ContabilidadContext context, IADORepository repository) : ICategoryService
{
    public async Task<ApiResponse> AddAsync(Category category)
    {
        if (await context.Categories.AnyAsync(x => x.Code == category.Code))
        {
            return new ApiResponse { code = "0", message = "Código ya existe" };
        }

        context.Categories.Add(category);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Registrado correctamente", payload = category };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var category = await context.Categories.FindAsync(id);
        if (category == null)
        {
            return new ApiResponse { code = "0", message = "Categoría no existe" };
        }

        category.Enabled = false;
        category.Deleted = true;
        category.UserId = userId;
        context.Update(category);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Eliminada exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Contabilidad.Category_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true))
        {
            return new ApiResponse { code = "0", message = "Data not found" };
        }

        return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Category category)
    {
        var categoryFound = await context.Categories.FindAsync(id);
        if (categoryFound == null) { return new ApiResponse { code = "0", message = "Categoría no encontrada" }; }

        categoryFound.Code = category.Code;
        categoryFound.Name = category.Name;
        categoryFound.Enabled = category.Enabled;
        categoryFound.TipoId = category.TipoId;
        categoryFound.UserId = category.UserId;
        context.Update(categoryFound);
        await context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Actualizado exitosamente" };
    }
}
