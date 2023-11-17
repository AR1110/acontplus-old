using Common.Core.Interfaces;
using Inventario.Core.Interfaces;

namespace Inventario.Application.Services
{
    public class StockService : IStockService
    {
        private readonly IADORepository _repository;
        public StockService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Inventario.Articulo_Update_Stock", parameters);
        }
    }
}
