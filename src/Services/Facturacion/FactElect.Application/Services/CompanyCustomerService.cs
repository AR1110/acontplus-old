namespace FactElect.Application.Services;

public class CompanyCustomerService(IAdoRepository repository) : ICompanyCustomerService
{
    private const string ModuleName = "Ventas.Cliente_";

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> data)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", data);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> data)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{ModuleName}Delete", data);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get", parameters, false);
        if (DataValidation.DataSetIsNull(ds))
            return new ApiResponse { Code = "0", Message = "No se encontraron clientes" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) };
    }

    public async Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get_Search", parameters, withTableNames: false);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "No se encontraron clientes con estos datos" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> GetIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get_Id", parameters, withTableNames: false);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "No se encontró datos del cliente" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> data)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", data);
    }
}