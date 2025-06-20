using System.Data;
using Common.Core.Abstractions;

namespace Restaurant.Application.Services;

public class ConsumptionConfigService(IAdoRepository adoRepository) : IConsumptionConfigService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.ConfigTpv_Get", parameters, withTableNames: false);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found!" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConfigTpv_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConfigTpv_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConfigTpv_Delete", parameters);
    }

    public async Task<ApiResponse> GetPrinterAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.ConfigPrinter_Get", parameters, withTableNames: false);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "Data not found!" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> AddPrinterAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConfigPrinter_Insert", parameters);
    }
}