public class CategoryService : ICategoryService
{
    private readonly TechnicalSupportContext _context;
    private readonly IADORepository _repository;

    public CategoryService(TechnicalSupportContext context, IADORepository repository)
    {
        _context = context;
        _repository = repository;
    }

    public async Task<ApiResponse> AddAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Guardada Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            // Handle case where category not found
            return new ApiResponse { code = "0", message = "Categoría no encontrada" };
        }

        category.Enabled = false;
        category.Deleted = true;
        category.UserId = userId;
        _context.Update(category);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Eliminada Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        if (!await _context.Categories.AnyAsync())
        {
            return new ApiResponse { code = "0", message = "No data" };
        }

        var dt = await _repository.GetDataTableAsync("TechnicalSupport.Category_Get", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new ApiResponse { code = "0", message = "No data" };
        }

        return new ApiResponse { code = "1", payload = DataConverters.DataTableToJSON(dt) };
    }


    public async Task<ApiResponse> UpdateAsync(int id, Category category)
    {
        var categoryFound = await _context.Categories.FindAsync(id);
        if (categoryFound == null)
        {
            // Handle case where category not found
            return new ApiResponse { code = "0", message = "Categoría no encontrada" };
        }

        categoryFound.CompanyId = category.CompanyId;
        categoryFound.Code = category.Code;
        categoryFound.Enabled = category.Enabled;
        categoryFound.Name = category.Name;
        categoryFound.UserId = category.UserId;
        _context.Update(categoryFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Actualizada Exitosamente" };
    }
}
