namespace Configuracion.API.Interfaces.WizardConfig;

public interface ICompanyDemoStepService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
