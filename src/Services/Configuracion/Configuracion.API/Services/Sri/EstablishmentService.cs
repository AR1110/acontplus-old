namespace Configuracion.API.Services.Sri;

public class EstablishmentService : IEstablishmentService
{
    private readonly IADORepository _repository;
    private readonly string nameSchema = "Sri.Establishment_";

    public EstablishmentService(IADORepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteAsync(nameSchema + "Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteAsync(nameSchema + "Update", parameters);
    }

    public async Task<ApiResponse> PutSriAuth(Dictionary<string, object> parameters)
    {
        var query = @"UPDATE Sri.Establecimiento SET autoSriAuth = @autoSriAuth WHERE idEstablecimiento = @id";
        var affectedRows = await _repository.OnlyExecuteAsync(query, parameters, false);
        if (affectedRows > 0)
        {
            return new ApiResponse { code = "1", message = "Actualizado Exitosamente!" };
        }
        
            return new ApiResponse { code = "0", message = "No se pudo actualizar!" };
        
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteAsync(nameSchema + "Delete", parameters);
    }
}
