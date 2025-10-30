namespace Configuration.Application.Interfaces.WizardConfig;

public interface ICompanyDemoStepService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
