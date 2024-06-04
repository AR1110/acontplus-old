using Common.Core.Interfaces;
using Inventario.API.Interfaces;

namespace Inventario.API.Services;

public class StockService : IStockService
{
    private readonly IAdoRepository _repository;

    public StockService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Inventario.Articulo_Update_Stock", parameters);
    }
}
