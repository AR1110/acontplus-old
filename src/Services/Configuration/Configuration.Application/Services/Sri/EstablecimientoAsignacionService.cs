namespace Configuration.Application.Services.Sri;

public class EstablecimientoAsignacionService(IAdoRepository repository) : IEstablecimientoAsignacionService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Config.Estab_Asig_Get", parameters);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return !DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) }
            : new SpResponse { Code = "0", Message = "Not found" };
    }

    public async Task<SpResponse> GetDataFormAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Config.Estab_Asig_Get_Data_Form", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "0", Message = "No Data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Config.Estab_Asig_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Config.Estab_Asig_Update", parameters);
    }
}
