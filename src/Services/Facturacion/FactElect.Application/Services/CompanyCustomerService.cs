using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using FactElect.Core.Interfaces;

namespace FactElect.Application.Services;

public class CompanyCustomerService : ICompanyCustomerService
{
    private readonly IAdoRepository _repository;

    public CompanyCustomerService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> AddAsync(Dictionary<string, object> data)
    {
        return await _repository.SpExecuteDeprecatedAsync("Ventas.Cliente_Insert", data);
    }

    public async Task<string> DeleteAsync(Dictionary<string, object> data)
    {
        return await _repository.SpExecuteDeprecatedAsync("Ventas.Cliente_Delete", data);
    }

    public async Task<ApiResponseDeprecated> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Ventas.Cliente_Get", parameters, true);
        if (DataValidation.DataSetIsNull(ds, true))
        {
            return new ApiResponseDeprecated { code = "0", message = "No se encontraron clientes" };
        }

        return new ApiResponseDeprecated { code = "1", payload = DataConverters.DataSetToJson(ds, true) };
    }

    public async Task<ApiResponseDeprecated> SearchAsync(Dictionary<string, object> parameters)
    {
        var dt = await _repository.GetDataTableAsync("Ventas.Cliente_Get_Search", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new ApiResponseDeprecated { code = "0", message = "No se encontraron clientes con estos datos" };
        }

        return new ApiResponseDeprecated { code = "1", payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponseDeprecated> GetIdAsync(Dictionary<string, object> parameters)
    {
        var dt = await _repository.GetDataTableAsync("Ventas.Cliente_Get_Id", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new ApiResponseDeprecated { code = "0", message = "No se encontró datos del cliente" };
        }

        return new ApiResponseDeprecated { code = "1", payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<string> UpdateAsync(Dictionary<string, object> data)
    {
        return await _repository.SpExecuteDeprecatedAsync("Ventas.Cliente_Update", data);
    }
}
