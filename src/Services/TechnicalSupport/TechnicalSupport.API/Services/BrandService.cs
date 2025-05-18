namespace TechnicalSupport.API.Services;

public class BrandService : IBrandService
{
    private readonly IAdoRepository _adoRepository;
    private readonly TechnicalSupportContext _context;

    public BrandService(TechnicalSupportContext context, IAdoRepository adoRepository)
    {
        _context = context;
        _adoRepository = adoRepository;
    }

    public async Task<ApiResponse> AddAsync(Brand brand)
    {
        if (brand.Series.Count > 0)
            foreach (var item in brand.Series)
                item.UserId = brand.UserId;

        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Guardada Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var brand = await _context.Brands.FindAsync(id);
        brand.Enabled = false;
        brand.Deleted = true;
        _context.Update(brand);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        if (!await _context.Brands.AnyAsync()) return new ApiResponse { Code = "0", Message = "No data" };

        var dt = await _adoRepository.GetDataTableAsync("TechnicalSupport.Brand_Get", parameters);
        if (DataValidation.DataTableIsNull(dt)) return new ApiResponse { Code = "0", Message = "No data" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Brand brand)
    {
        if (brand.Series.Count > 0)
            foreach (var item in brand.Series)
                if (item.Id == 0)
                    item.UserId = brand.UserId;

        var brandFound = await _context.Brands.FindAsync(id);
        brandFound.Code = brand.Code;
        brandFound.Enabled = brand.Enabled;
        brandFound.Name = brand.Name;
        brandFound.Series = brand.Series;
        _context.Update(brandFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizada Exitosamente" };
    }
}