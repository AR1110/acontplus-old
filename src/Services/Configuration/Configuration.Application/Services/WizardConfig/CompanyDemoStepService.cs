namespace Configuration.Application.Services.WizardConfig;

public class CompanyDemoStepService(IAdoRepository adoRepository) : Interfaces.WizardConfig.ICompanyDemoStepService
{
    private readonly string ModuleName = "Config.CompanyDemoStep_";

    public Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "No data found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
