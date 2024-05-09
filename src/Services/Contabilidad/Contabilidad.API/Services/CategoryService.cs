namespace Contabilidad.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ContabilidadContext _context;

        public CategoryService(ContabilidadContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse> AddAsync(Category category)
        {
            if (await _context.Categories.AnyAsync(x => x.Code == category.Code))
            {
                return new ApiResponse { code = "0", message = "Código ya existe" };
            }
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return new ApiResponse { code = "1", message = "Registrado correctamente", payload = category };
        }

        public async Task<ApiResponse> DeleteAsync(int userId, int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return new ApiResponse { code = "0", message = "Categoría no existe" };
            }
            category.Enabled = false;
            category.Deleted = true;
            category.UserId = userId;
            _context.Update(category);
            await _context.SaveChangesAsync();
            return new ApiResponse { code = "1", message = "Eliminada exitosamente" };
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var categories = await _context.Categories.Where(x => x.Enabled == true).ToListAsync();
            if (categories.Count == 0)
            {
                return new ApiResponse { code = "0", message = "No data" };
            }
            return new ApiResponse { code = "1", payload = DataConverters.SerializeObjectCustom<List<Category>>(categories) };
        }

        public async Task<ApiResponse> UpdateAsync(int id, Category category)
        {
            var categoryFound = await _context.Categories.FindAsync(id);
            if (categoryFound == null) { return new ApiResponse { code = "0", message = "Categoría no encontrada" }; }
            categoryFound.Code = category.Code;
            categoryFound.Name = category.Name;
            categoryFound.Enabled = category.Enabled;
            categoryFound.TipoId = category.TipoId;
            categoryFound.UserId = category.UserId;
            _context.Update(categoryFound);
            await _context.SaveChangesAsync();
            return new ApiResponse { code = "1", message = "Actualizado exitosamente" };
        }
    }
}
