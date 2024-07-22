namespace Configuracion.API.Interfaces.WizardConfig;

public interface IDemoStepService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
