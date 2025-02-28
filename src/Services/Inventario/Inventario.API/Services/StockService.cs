namespace Inventario.API.Services;

public class StockService(IAdoRepository _repository) : IStockService
{

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Inventario.Articulo_Update_Stock", parameters);
    }
}
