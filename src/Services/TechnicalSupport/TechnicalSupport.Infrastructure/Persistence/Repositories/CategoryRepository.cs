using System.Data;

namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly IAdoRepository _adoRepository;
    private readonly TechnicalSupportContext _context;

    public CategoryRepository(TechnicalSupportContext context, IAdoRepository adoRepository)
    {
        _context = context;
        _adoRepository = adoRepository;
    }

    public async Task<ApiResponse> AddAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Guardada Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            // Handle case where category not found
            return new ApiResponse { Code = "0", Message = "Categoría no encontrada" };

        category.MarkAsDeleted(userId);
        _context.Update(category);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        if (!await _context.Categories.AnyAsync()) return new ApiResponse { Code = "0", Message = "No data" };

        var ds = await _adoRepository.GetDataSetAsync("TechnicalSupport.Category_Get", parameters,
            withTableNames: false);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "No data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }


    public async Task<ApiResponse> UpdateAsync(int id, Category category)
    {
        var categoryFound = await _context.Categories.FindAsync(id);
        if (categoryFound == null)
            // Handle case where category not found
            return new ApiResponse { Code = "0", Message = "Categoría no encontrada" };

        categoryFound.CompanyId = category.CompanyId;
        categoryFound.Code = category.Code;
        categoryFound.IsActive = category.IsActive;
        categoryFound.Name = category.Name;
        categoryFound.UpdatedByUserId = category.UpdatedByUserId;
        _context.Update(categoryFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizada Exitosamente" };
    }
}
