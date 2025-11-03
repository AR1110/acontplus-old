namespace Configuration.Application.Services.Sri;

public class EstablishmentService : IEstablishmentService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Sri.Establishment_";

    public EstablishmentService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
        return ds.Tables.Count == 0 ? null : (object)DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Update", parameters);
    }

    public async Task<SpResponse> PutSriAuth(Dictionary<string, object> parameters)
    {
        return new SpResponse { Code = "0", Message = "No disponible" };

        //var query = @"UPDATE Sri.Establecimiento SET autoSriAuth = @autoSriAuth WHERE idEstablecimiento = @id";
        //var affectedRows = await _repository.ExecuteNonQueryAsync(query, parameters, false);
        //if (affectedRows > 0) return new SpResponse { Code = "1", Message = "Actualizado Exitosamente!" };

        //return new SpResponse { Code = "0", Message = "No se pudo actualizar!" };
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Delete", parameters);
    }
}
