namespace FactElect.API.Services;

public class CompanyCustomerService(IAdoRepository repository) : ICompanyCustomerService
{
    private const string nameSp = "Ventas.Cliente_";
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> data)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{nameSp}Insert", data);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> data)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{nameSp}Delete", data);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{nameSp}Get", parameters, false);
        if (DataValidation.DataSetIsNull(ds))
        {
            return new ApiResponse { Code = "0", Message = "No se encontraron clientes" };
        }

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) };
    }

    public async Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var dt = await repository.GetDataTableAsync($"{nameSp}Get_Search", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new ApiResponse { Code = "0", Message = "No se encontraron clientes con estos datos" };
        }

        return new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> GetIdAsync(Dictionary<string, object> parameters)
    {
        var dt = await repository.GetDataTableAsync($"{nameSp}Get_Id", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new ApiResponse { Code = "0", Message = "No se encontró datos del cliente" };
        }

        return new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> data)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{nameSp}Update", data);
    }
}
