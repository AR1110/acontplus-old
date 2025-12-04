namespace Inventory.Infrastructure.Persistence.Repositories;

public class ProductPhotoRepository : IProductPhotoRepository
{
    private readonly InventoryContext _context;
    private readonly IAdoRepository _repository;

    public ProductPhotoRepository(InventoryContext context, IAdoRepository repository)
    {
        _context = context;
        _repository = repository;
    }

    public async Task<SpResponse> GetAsync(int productId)
    {
        if (!_context.ProductPhotos.Any(x => x.ProductId == productId))
            return new SpResponse { Code = "0", Message = "No se encontraron imagenes!" };

        var photos = await _context.ProductPhotos.AsNoTracking().Where(x => x.ProductId == productId).ToListAsync();
        return new SpResponse { Code = "1", Payload = photos };
    }

    public async Task<SpResponse> AddAsync(ProductPhoto productPhoto)
    {
        var total = _context.ProductPhotos.Where(x => x.ProductId == productPhoto.ProductId).Count();
        if (total == 4)
            return new SpResponse { Code = "0", Message = "Solo puede subir hasta cuatro imagenes por producto!" };

        if (!_context.ProductPhotos.Any(x => x.ProductId == productPhoto.ProductId)) productPhoto.IsDefault = true;

        _context.Add(productPhoto);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrada exitosamente!" };
    }

    public async Task<SpResponse> UpdateAsync(int id, ProductPhoto productPhoto)
    {
        if (id != productPhoto.Id) return new SpResponse { Code = "0", Message = "Id no coincide" };

        ;
        var productFound = await _context.ProductPhotos.FindAsync(id);
        if (productFound == null) return new SpResponse { Code = "0", Message = "No existe el registro!" };

        ;
        productFound.S3ObjectKey = productPhoto.S3ObjectKey;
        productFound.S3ObjectUrl = productPhoto.S3ObjectUrl;
        productFound.IsActive = productPhoto.IsActive;
        productFound.UpdatedByUserId = productPhoto.UpdatedByUserId;
        _context.Update(productFound);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizada exitosamente!" };
    }

    public async Task<SpResponse> SetDefaultAsync(int id, bool isDefault, int userId)
    {
        var productFound = await _context.ProductPhotos.FindAsync(id);
        if (productFound == null) return new SpResponse { Code = "0", Message = "No existe el registro!" };

        ;
        productFound.IsDefault = isDefault;
        productFound.UpdatedByUserId = userId;
        if (isDefault && _context.ProductPhotos.Any(x =>
                x.Id != id && x.ProductId == productFound.ProductId && x.IsDefault == true))
        {
            var nonDefaults = await _context.ProductPhotos
                .Where(x => x.Id != id && x.ProductId == productFound.ProductId && x.IsDefault == true).ToListAsync();
            nonDefaults.ForEach(x => x.IsDefault = false);
            nonDefaults.ForEach(x => x.UpdatedByUserId = userId);
            _context.UpdateRange(nonDefaults);
            await _context.SaveChangesAsync();
        }

        _context.Update(productFound);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizada exitosamente!" };
    }

    public async Task<SpResponse> DeleteAsync(int id, int userId)
    {
        var productFound = await _context.ProductPhotos.FindAsync(id);
        if (productFound.IsDefault && _context.ProductPhotos.Any(x => x.ProductId == productFound.ProductId))
        {
            var nextDefault =
                await _context.ProductPhotos.FirstOrDefaultAsync(x =>
                    x.Id != id && x.ProductId == productFound.ProductId);
            nextDefault.CreatedByUserId = userId;
            nextDefault.IsDefault = true;
            _context.Update(nextDefault);
            await _context.SaveChangesAsync();
        }

        _context.Remove(productFound);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada exitosamente!", Payload = productFound.S3ObjectKey };
    }
}
