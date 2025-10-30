namespace Configuration.Application.Services;

public class EmpresaService(IAdoRepository AdoRepository) : IEmpresaService
{
    private const string NameSchema = "Administrador.Empresa_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await AdoRepository.GetDataSetAsync($"{NameSchema}Get", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new SpResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "Insert", parameters);
    }


    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "Delete", parameters);
    }
}
