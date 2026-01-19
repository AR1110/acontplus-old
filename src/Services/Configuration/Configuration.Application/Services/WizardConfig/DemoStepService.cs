namespace Configuration.Application.Services.WizardConfig;

public class DemoStepService(IAdoRepository adoRepository) : Interfaces.WizardConfig.IDemoStepService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Config.DemoStep_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "No data found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
