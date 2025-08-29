using System.Data;

namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class BrandRepository(TechnicalSupportContext context, IAdoRepository adoRepository)
    : IBrandRepository
{
    public async Task<ApiResponse> AddAsync(Brand brand)
    {
        if (brand.Series.Count > 0)
            foreach (var item in brand.Series)
                item.UserId = brand.UserId;

        context.Brands.Add(brand);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Guardada Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var brand = await context.Brands.FindAsync(id);
        if (brand == null)
            // Handle case where brand not found
            return new ApiResponse { Code = "0", Message = "Marca no encontrada" };
        brand.MarkAsDeleted(userId);
        context.Update(brand);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        if (!await context.Brands.AnyAsync()) return new ApiResponse { Code = "0", Message = "No data" };

        var ds = await adoRepository.GetDataSetAsync("TechnicalSupport.Brand_Get", parameters, withTableNames: false);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "No data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Brand brand)
    {
        if (brand.Series.Count > 0)
            foreach (var item in brand.Series.Where(item => item.Id == 0))
                item.UpdatedByUserId = brand.UpdatedByUserId;

        var brandFound = await context.Brands.FindAsync(id);
        if (brandFound == null)
            // Handle case where brand not found
            return new ApiResponse { Code = "0", Message = "Marca no encontrada" };
        brandFound.Code = brand.Code;
        brandFound.IsActive = brand.IsActive;
        brandFound.Name = brand.Name;
        brandFound.Series = brand.Series;
        brandFound.UpdatedByUserId = brand.UpdatedByUserId;
        context.Update(brandFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizada Exitosamente" };
    }
}
