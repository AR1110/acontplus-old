namespace Configuracion.Application.Interfaces.WizardConfig;

public interface ICompanyDemoStepService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}