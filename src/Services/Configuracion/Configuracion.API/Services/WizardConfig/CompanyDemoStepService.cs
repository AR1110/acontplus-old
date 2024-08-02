using Configuracion.API.Interfaces.WizardConfig;

namespace Configuracion.API.Services.WizardConfig;

public class CompanyDemoStepService(IAdoRepository adoRepository) : ICompanyDemoStepService
{
    private string ModuleName = "Config.CompanyDemoStep_";
    public Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "No data found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
