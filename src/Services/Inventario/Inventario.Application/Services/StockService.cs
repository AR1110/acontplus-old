namespace Inventario.Application.Services;

public class StockService(IAdoRepository _repository) : IStockService
{
    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Inventario.Articulo_Update_Stock", parameters);
    }
}
