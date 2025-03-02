namespace FactElect.Application.Interfaces.Sri;

public interface ICatalogoService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}

