namespace Ventas.Application.Services;

public class ClienteService(IAdoRepository adoRepository) : IClienteService
{
    private const string ModuleName = "Ventas.Cliente_";

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new SpResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get_Id", parameters);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<SpResponse> GetDataFormAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Data_Form", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new SpResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<SpResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Search", parameters);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException();
    }
}
