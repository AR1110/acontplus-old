using Contabilidad.Domain.Repositories;
using Contabilidad.Infrastructure.Persistence;

namespace Contabilidad.Infrastructure.Persistence.Repositories;

public class CategoryRepository(ContabilidadContext context, IAdoRepository repository) : ICategoryRepository
{
    public async Task<ApiResponse> AddAsync(Category category)
    {
        if (await context.Categories.AnyAsync(x => x.Code == category.Code))
            return new ApiResponse { Code = "0", Message = "Código ya existe" };

        context.Categories.Add(category);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrado correctamente", Payload = category };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var category = await context.Categories.FindAsync(id);
        if (category == null) return new ApiResponse { Code = "0", Message = "Categoría no existe" };

        category.MarkAsDeleted(userId);
        context.Update(category);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Contabilidad.Category_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true)) return new ApiResponse { Code = "0", Message = "Data not found" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Category category)
    {
        var categoryFound = await context.Categories.FindAsync(id);
        if (categoryFound == null) return new ApiResponse { Code = "0", Message = "Categoría no encontrada" };

        categoryFound.Code = category.Code;
        categoryFound.Name = category.Name;
        categoryFound.IsActive = category.IsActive;
        categoryFound.TipoId = category.TipoId;
        categoryFound.UpdatedByUserId = category.UpdatedByUserId;
        context.Update(categoryFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente" };
    }
}
