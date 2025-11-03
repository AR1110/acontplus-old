namespace Billing.Application.Services;

public class CompanyCustomerService(IAdoRepository repository) : ICompanyCustomerService
{
    private const string ModuleName = "Ventas.Cliente_";

    public async Task<SpResponse> AddAsync(Dictionary<string, object> data)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", data);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> data)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", data);
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "0", Message = "No se encontraron clientes" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get_Search", parameters);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "No se encontraron clientes con estos datos" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<SpResponse> GetIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get_Id", parameters);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "No se encontró datos del cliente" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> data)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", data);
    }
}
