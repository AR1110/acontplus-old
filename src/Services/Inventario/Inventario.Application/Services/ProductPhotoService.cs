using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Inventario.Core.Entities;
using Inventario.Core.Interfaces;
using Inventario.Infrastructure.Data;

namespace Inventario.Application.Services
{
    public class ProductPhotoService : IProductPhotoService
    {
        private readonly InventarioContext _context;
        private readonly IADORepository _repository;
        public ProductPhotoService(InventarioContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Inventario.ProductPhoto_Get", parameters);
            if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                return null;
            }
            return DataConverters.DataSetToJSON(ds);
        }
        public async Task<APIResponse> AddAsync(ProductPhoto productPhoto)
        {
            try
            {
                _context.Add(productPhoto);
                await _context.SaveChangesAsync();
                return new APIResponse { code = "1", message = "Registrada exitosamente!" };
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<APIResponse> UpdateAsync(int id, ProductPhoto productPhoto)
        {
            try
            {
                if (id != productPhoto.Id) { return new APIResponse { code = "0", message = "Id no coincide" }; };
                var productFound = await _context.ProductPhotos.FindAsync(id);
                if (productFound == null) { return new APIResponse { code = "0", message = "No existe el registro!" }; };
                productFound.S3ObjectKey = productPhoto.S3ObjectKey;
                productFound.S3ObjectUrl = productPhoto.S3ObjectUrl;
                productFound.Enabled = productPhoto.Enabled;
                productFound.UserId = productPhoto.UserId;
                _context.Update(productFound);
                await _context.SaveChangesAsync();
                return new APIResponse { code = "1", message = "Actualizada exitosamente!" };
            }
            catch (Exception)
            {

                throw;
            }
        }
        public async Task<object> DeleteAsync(int id, int userId)
        {
            try
            {
                var productFound = await _context.ProductPhotos.FindAsync(id);
                if (productFound == null) { return new { code = "0", message = "No existe el registro!" }; };
                productFound.Enabled = false;
                productFound.Deleted = true;
                productFound.UserId = userId;
                _context.Update(productFound);
                await _context.SaveChangesAsync();
                return new { code = "1", message = "Eliminada exitosamente!" };
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
