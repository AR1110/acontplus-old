namespace TechnicalSupport.API.Services
{
    public class BrandService : IBrandService
    {
        private readonly IADORepository _repository;
        private readonly TechnicalSupportContext _context;
        public BrandService(TechnicalSupportContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }

        public async Task<ApiResponse> AddAsync(Brand brand)
        {
            try
            {
                if (await _context.Brands.AnyAsync(x => x.Code == brand.Code))
                {
                    return new ApiResponse { code = "0", message = "Este código ya se encuentra registrado" };
                }
                if (brand.Series.Count > 0)
                {
                    foreach (var item in brand.Series)
                    {
                        item.UserId = brand.UserId;
                    }

                }
                _context.Brands.Add(brand);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Guardada Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> DeleteAsync(int userId, int id)
        {
            try
            {
                var brand = await _context.Brands.FindAsync(id);
                brand.Enabled = false;
                brand.Deleted = true;
                _context.Update(brand);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Eliminada Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                if (!await _context.Brands.AnyAsync())
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                //var brands = await _context.Brands
                //    .Include(b => b.Category)
                //    .Select(b => new
                //    {
                //        b.Id,
                //        b.Name,
                //        b.Code,
                //        b.Enabled,
                //        CategoryCode = b.Category.Code,
                //        CategoryName = b.Category.Name,
                //    }).ToListAsync();

                //return new ApiResponse { code = "1", payload = DataConverters.SerializeObjectCustom<List<Brand>>(brands) };

                var dt = await _repository.GetDataTableAsync("TechnicalSupport.Brand_Get", parameters);
                if (DataValidation.DataTableIsNull(dt))
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                return new ApiResponse { code = "1", payload = DataConverters.DataTableToJSON(dt) };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> UpdateAsync(int id, Brand brand)
        {
            try
            {
                if (brand.Series.Count > 0)
                {
                    foreach (var item in brand.Series)
                    {
                        if (item.Id == 0)
                        {
                            item.UserId = brand.UserId;
                        }
                    }

                }
                var brandFound = await _context.Brands.FindAsync(id);
                brandFound.Code = brand.Code;
                brandFound.Enabled = brand.Enabled;
                brandFound.Name = brand.Name;
                brandFound.Series = brand.Series;
                _context.Update(brandFound);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Actualizada Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
