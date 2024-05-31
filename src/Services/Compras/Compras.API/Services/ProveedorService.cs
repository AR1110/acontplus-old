namespace Compras.API.Services;

public class ProveedorService : IProveedorService
{
    private readonly IAdoRepository _repository;

    public ProveedorService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Compra.Proveedor_Get", parameters);
        if (ds.Tables[0].Rows.Count == 0) { return null; }

        return DataConverters.DataSetToJSON(ds);
    }

    public async Task<string> AddAsync(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId }, { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteDeprecatedAsync("Compra.Proveedor_Insert", parameters);
    }

    public async Task<string> UpdateAsync(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteDeprecatedAsync("Compra.Proveedor_Update", parameters);
    }

    public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Compra.Proveedor_Delete", parameters);
    }
}
