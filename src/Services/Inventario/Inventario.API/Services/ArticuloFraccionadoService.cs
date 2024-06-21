namespace Inventario.API.Services;

public class ArticuloFraccionadoService : IArticuloFraccionadoService
{
    private readonly IAdoRepository _repository;

    public ArticuloFraccionadoService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Inventario.Fraccionado_Get", parameters);

        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            if (ds.Tables.Count > 0)
            {
                ds = new DataSet();
            }

            return null;
        }

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<string> AddAsync(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId }, { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteDeprecatedAsync("Inventario.Fraccionado_Insert", parameters);
    }

    public async Task<string> UpdateAsync(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await _repository.SpExecuteDeprecatedAsync("Inventario.Fraccionado_Update", parameters);
    }

    public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Inventario.Fraccionado_Delete", parameters);
    }
}
