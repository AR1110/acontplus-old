namespace Configuration.Application.Interfaces.WizardConfig;

public interface IDemoStepService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
