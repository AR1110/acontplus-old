
namespace Contabilidad.API.Services
{
    public class SubcategoryService : ISubcategoryService
    {
        private readonly ContabilidadContext _context;
        private readonly IADORepository _repository;

        public SubcategoryService(ContabilidadContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }

        public async Task<ApiResponse> AddAsync(Subcategory subcategory)
        {
            if (await _context.Subcategories.AnyAsync(x => x.CompanyId == subcategory.CompanyId & x.Code == subcategory.Code))
            {
                return new ApiResponse { code = "0", message = "Código ya existe" };
            }
            _context.Subcategories.Add(subcategory);
            await _context.SaveChangesAsync();
            return new ApiResponse { code = "1", message = "Registrada exitosamente" };
        }

        public async Task<ApiResponse> DeleteAsync(int userId, int id)
        {
            var subcategory = await _context.Subcategories.FirstOrDefaultAsync(x => x.Id == id);
            if (subcategory == null) { return new ApiResponse { code = "0", message = "Subcategoría no encontrada" }; }
            subcategory.Enabled = false;
            subcategory.Deleted = true;
            subcategory.UserId = userId;
            _context.Update(subcategory);
            await _context.SaveChangesAsync();
            return new ApiResponse { code = "1", message = "Eliminada exitosamente" };
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Contabilidad.Subcategory_Get", parameters);
            if (DataValidation.DataSetIsNull(ds, true))
            {
                return new ApiResponse { code = "0", message = "Data not found" };
            }
            return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
        }

        public async Task<ApiResponse> UpdateAsync(int id, Subcategory subcategory)
        {
            var subcategoryFound = await _context.Subcategories.FindAsync(id);
            if (subcategoryFound == null)
            {
                return new ApiResponse { code = "0", message = "Subcategoría no encontrada" };
            }
            subcategoryFound.CategoryId = subcategory.CategoryId;
            subcategoryFound.Code = subcategory.Code;
            subcategoryFound.Name = subcategory.Name;
            subcategoryFound.Enabled = subcategory.Enabled;
            subcategoryFound.UserId = subcategory.UserId;
            _context.Update(subcategoryFound);
            await _context.SaveChangesAsync();
            return new ApiResponse { code = "1", message = "Actualizada exitosamente" };
        }
    }
}
