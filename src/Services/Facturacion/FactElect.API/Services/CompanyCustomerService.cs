using Common.AppSettings;

namespace FactElect.API.Services;

public class CompanyCustomerService(IAdoRepository repository) : ICompanyCustomerService
{
    private const string nameSp= "Ventas.Cliente_";
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> data)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{nameSp}Insert", data);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> data)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{nameSp}Delete", data);
    }

    public async Task<LegacyApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{nameSp}Get", parameters, false);
        if (DataValidation.DataSetIsNull(ds))
        {
            return new LegacyApiResponse { code = "0", message = "No se encontraron clientes" };
        }

        return new LegacyApiResponse { code = "1", payload = DataConverters.DataSetToJson(ds, true) };
    }

    public async Task<LegacyApiResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var dt = await repository.GetDataTableAsync($"{nameSp}Get_Search", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new LegacyApiResponse { code = "0", message = "No se encontraron clientes con estos datos" };
        }

        return new LegacyApiResponse { code = "1", payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<LegacyApiResponse> GetIdAsync(Dictionary<string, object> parameters)
    {
        var dt = await repository.GetDataTableAsync($"{nameSp}Get_Id", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new LegacyApiResponse { code = "0", message = "No se encontró datos del cliente" };
        }

        return new LegacyApiResponse { code = "1", payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> data)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{nameSp}Update", data);
    }
}
