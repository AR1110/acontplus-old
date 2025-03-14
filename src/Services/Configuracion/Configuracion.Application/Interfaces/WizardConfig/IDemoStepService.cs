namespace Configuracion.Application.Interfaces.WizardConfig;

public interface IDemoStepService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
