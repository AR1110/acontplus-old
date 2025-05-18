namespace Ventas.API.Services;

public class ClienteService(IAdoRepository AdoRepository) : IClienteService
{
    private const string ModuleName = "Ventas.Cliente_";

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Delete", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await AdoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, false);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var dt = await AdoRepository.GetDataTableAsync($"{ModuleName}Get_Id", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> GetDataFormAsync(Dictionary<string, object> parameters)
    {
        var ds = await AdoRepository.GetDataSetAsync($"{ModuleName}Data_Form", parameters, false);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters)
    {
        var dt = await AdoRepository.GetDataTableAsync($"{ModuleName}Search", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException();
    }
}