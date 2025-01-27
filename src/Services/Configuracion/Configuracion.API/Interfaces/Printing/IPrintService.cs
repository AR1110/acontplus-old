namespace Configuracion.API.Interfaces.Printing;

public interface IPrintService
{
    Task<string> GetAsync(Dictionary<string, object> parameters);
}
