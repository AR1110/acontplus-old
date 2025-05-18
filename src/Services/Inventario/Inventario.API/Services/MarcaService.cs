namespace Inventario.API.Services;

public class MarcaService : IMarcaService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Inventario.Marca";

    public MarcaService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            return new ApiResponse { Code = "0", Message = "Sin registros", Payload = null };


        return new ApiResponse
        {
            Code = "1",
            Message = "Listado exitosamente",
            Payload = DataConverters.DataSetToJson(ds)
        };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "_Delete", parameters);
    }
}