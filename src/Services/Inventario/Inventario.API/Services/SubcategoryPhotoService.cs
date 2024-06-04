using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Inventario.API.Data;
using Inventario.API.Entities;
using Inventario.API.Interfaces;

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

        return DataConverters.DataSetToJSON(ds);
    }

    public async Task<ApiResponse> AddAsync(SubcategoryPhoto data)
    {
        if (!_context.SubcategorytPhotos.Any(x => x.SubcategoryId == data.SubcategoryId))
        {
            data.IsDefault = true;
        }

        _context.Add(data);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Registrada exitosamente!" };
    }

    public async Task<ApiResponse> UpdateAsync(int id, SubcategoryPhoto data)
    {
        if (id != data.Id) { return new ApiResponse { code = "0", message = "Id no coincide" }; }

        ;
        var productFound = await _context.SubcategorytPhotos.FindAsync(id);
        if (productFound == null) { return new ApiResponse { code = "0", message = "No existe el registro!" }; }

        ;
        productFound.S3ObjectKey = data.S3ObjectKey;
        productFound.S3ObjectUrl = data.S3ObjectUrl;
        productFound.Enabled = data.Enabled;
        productFound.UserId = data.UserId;
        _context.Update(productFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Actualizada exitosamente!" };
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
