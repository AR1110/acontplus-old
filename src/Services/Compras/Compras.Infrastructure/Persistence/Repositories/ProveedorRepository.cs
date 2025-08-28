namespace Compras.Infrastructure.Persistence.Repositories;

public class ProveedorRepository(IAdoRepository _repo) : IProveedorRepository
{
    private const string ModuleName = "Compra.Proveedor_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repo.GetDataSetAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repo.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repo.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repo.SpExecuteAsync<ApiResponse>($"{ModuleName}Delete", parameters);
    }
}
