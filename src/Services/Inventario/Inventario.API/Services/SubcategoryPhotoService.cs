using Common.AppSettings;

namespace Inventario.API.Services;

public class SubcategoryPhotoService : ISubcategoryPhotoService
{
    private readonly InventarioContext _context;
    private readonly IAdoRepository _repository;

    public SubcategoryPhotoService(InventarioContext context, IAdoRepository repository)
    {
        _context = context;
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Inventario.SubcategoryPhoto_Get", parameters);
        if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<ApiResponseDeprecated> AddAsync(SubcategoryPhoto data)
    {
        if (!_context.SubcategorytPhotos.Any(x => x.SubcategoryId == data.SubcategoryId))
        {
            data.IsDefault = true;
        }

        _context.Add(data);
        await _context.SaveChangesAsync();
        return new ApiResponseDeprecated { code = "1", message = "Registrada exitosamente!" };
    }

    public async Task<ApiResponseDeprecated> UpdateAsync(int id, SubcategoryPhoto data)
    {
        if (id != data.Id) { return new ApiResponseDeprecated { code = "0", message = "Id no coincide" }; }

        ;
        var productFound = await _context.SubcategorytPhotos.FindAsync(id);
        if (productFound == null) { return new ApiResponseDeprecated { code = "0", message = "No existe el registro!" }; }

        ;
        productFound.S3ObjectKey = data.S3ObjectKey;
        productFound.S3ObjectUrl = data.S3ObjectUrl;
        productFound.Enabled = data.Enabled;
        productFound.UserId = data.UserId;
        _context.Update(productFound);
        await _context.SaveChangesAsync();
        return new ApiResponseDeprecated { code = "1", message = "Actualizada exitosamente!" };
    }

    public async Task<object> DeleteAsync(int id, int userId)
    {
        var productFound = await _context.SubcategorytPhotos.FindAsync(id);
        if (productFound == null) { return new { code = "0", message = "No existe el registro!" }; }

        ;
        productFound.Enabled = false;
        productFound.Deleted = true;
        productFound.UserId = userId;
        _context.Update(productFound);
        await _context.SaveChangesAsync();
        return new { code = "1", message = "Eliminada exitosamente!" };
    }
}
