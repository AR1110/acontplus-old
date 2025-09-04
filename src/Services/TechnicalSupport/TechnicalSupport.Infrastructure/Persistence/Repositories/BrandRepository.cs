namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class BrandRepository(TechnicalSupportContext context, IAdoRepository adoRepository)
    : IBrandRepository
{
    public async Task<SpResponse> AddAsync(Brand brand)
    {
        if (brand.Series.Count > 0)
            foreach (var item in brand.Series)
                item.CreatedByUserId = brand.CreatedByUserId;

        context.Brands.Add(brand);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Guardada Exitosamente" };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var brand = await context.Brands.FindAsync(id);
        if (brand == null)
            // Handle case where brand not found
            return new SpResponse { Code = "0", Message = "Marca no encontrada" };
        brand.MarkAsDeleted(userId);
        context.Update(brand);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        if (!await context.Brands.AnyAsync()) return new SpResponse { Code = "0", Message = "No data" };

        var ds = await adoRepository.GetDataSetAsync("TechnicalSupport.Brand_Get", parameters);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "No data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<SpResponse> UpdateAsync(int id, Brand brand)
    {
        if (brand.Series.Count > 0)
            foreach (var item in brand.Series.Where(item => item.Id == 0))
                item.UpdatedByUserId = brand.UpdatedByUserId;

        var brandFound = await context.Brands.FindAsync(id);
        if (brandFound == null)
            // Handle case where brand not found
            return new SpResponse { Code = "0", Message = "Marca no encontrada" };
        brandFound.Code = brand.Code;
        brandFound.IsActive = brand.IsActive;
        brandFound.Name = brand.Name;
        brandFound.Series = brand.Series;
        brandFound.UpdatedByUserId = brand.UpdatedByUserId;
        context.Update(brandFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizada Exitosamente" };
    }
}
