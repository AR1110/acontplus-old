using Common.Core.Interfaces;
using Common.Core.Utils;
using Compras.API.Interfaces;

namespace Compras.API.Services
{
    public class ProveedorService : IProveedorService
    {
        private readonly IADORepository _repository;
        public ProveedorService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Compra.Proveedor_Get", parameters);
            if (ds.Tables[0].Rows.Count == 0) { return null; }
            return DataConverters.DataSetToJSON(ds);
        }
    }
}
