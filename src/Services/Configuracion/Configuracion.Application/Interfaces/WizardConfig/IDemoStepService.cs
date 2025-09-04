namespace Configuracion.Application.Interfaces.WizardConfig;

public interface IDemoStepService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
