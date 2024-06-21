namespace Inventario.API.Services;

public class ProductPhotoService : IProductPhotoService
{
    private readonly InventarioContext _context;
    private readonly IAdoRepository _repository;

    public ProductPhotoService(InventarioContext context, IAdoRepository repository)
    {
        _context = context;
        _repository = repository;
    }

    public async Task<ApiResponseDeprecated> GetAsync(int productId)
    {
        if (!_context.ProductPhotos.Any(x => x.ProductId == productId))
        {
            return new ApiResponseDeprecated { code = "0", message = "No se encontraron imagenes!" };
        }

        var photos = await _context.ProductPhotos.Where(x => x.ProductId == productId).ToListAsync();
        return new ApiResponseDeprecated { code = "1", payload = photos };
    }

    public async Task<ApiResponseDeprecated> AddAsync(ProductPhoto productPhoto)
    {
        var total = _context.ProductPhotos.Where(x => x.ProductId == productPhoto.ProductId).Count();
        if (total == 4)
        {
            return new ApiResponseDeprecated { code = "0", message = "Solo puede subir hasta cuatro imagenes por producto!" };
        }

        if (!_context.ProductPhotos.Any(x => x.ProductId == productPhoto.ProductId))
        {
            productPhoto.IsDefault = true;
        }

        _context.Add(productPhoto);
        await _context.SaveChangesAsync();
        return new ApiResponseDeprecated { code = "1", message = "Registrada exitosamente!" };
    }

    public async Task<ApiResponseDeprecated> UpdateAsync(int id, ProductPhoto productPhoto)
    {
        if (id != productPhoto.Id) { return new ApiResponseDeprecated { code = "0", message = "Id no coincide" }; }

        ;
        var productFound = await _context.ProductPhotos.FindAsync(id);
        if (productFound == null) { return new ApiResponseDeprecated { code = "0", message = "No existe el registro!" }; }

        ;
        productFound.S3ObjectKey = productPhoto.S3ObjectKey;
        productFound.S3ObjectUrl = productPhoto.S3ObjectUrl;
        productFound.Enabled = productPhoto.Enabled;
        productFound.UserId = productPhoto.UserId;
        _context.Update(productFound);
        await _context.SaveChangesAsync();
        return new ApiResponseDeprecated { code = "1", message = "Actualizada exitosamente!" };
    }

    public async Task<ApiResponseDeprecated> SetDefaultAsync(int id, bool isDefault, int userId)
    {
        var productFound = await _context.ProductPhotos.FindAsync(id);
        if (productFound == null) { return new ApiResponseDeprecated { code = "0", message = "No existe el registro!" }; }

        ;
        productFound.IsDefault = isDefault;
        productFound.UserId = userId;
        if (isDefault && _context.ProductPhotos.Any(x =>
                x.Id != id && x.ProductId == productFound.ProductId && x.IsDefault == true))
        {
            var nonDefaults = await _context.ProductPhotos
                .Where(x => x.Id != id && x.ProductId == productFound.ProductId && x.IsDefault == true).ToListAsync();
            nonDefaults.ForEach(x => x.IsDefault = false);
            nonDefaults.ForEach(x => x.UserId = userId);
            _context.UpdateRange(nonDefaults);
            await _context.SaveChangesAsync();
        }

        _context.Update(productFound);
        await _context.SaveChangesAsync();
        return new ApiResponseDeprecated { code = "1", message = "Actualizada exitosamente!" };
    }

    public async Task<ApiResponseDeprecated> DeleteAsync(int id, int userId)
    {
        var productFound = await _context.ProductPhotos.FindAsync(id);
        if (productFound.IsDefault && _context.ProductPhotos.Any(x => x.ProductId == productFound.ProductId))
        {
            var nextDefault =
                await _context.ProductPhotos.FirstOrDefaultAsync(x =>
                    x.Id != id && x.ProductId == productFound.ProductId);
            nextDefault.UserId = userId;
            nextDefault.IsDefault = true;
            _context.Update(nextDefault);
            await _context.SaveChangesAsync();
        }

        _context.Remove(productFound);
        await _context.SaveChangesAsync();
        return new ApiResponseDeprecated { code = "1", message = "Eliminada exitosamente!", payload = productFound.S3ObjectKey };
    }
}
