namespace Configuration.Application.Interfaces.Printing;

public interface IPrintService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
