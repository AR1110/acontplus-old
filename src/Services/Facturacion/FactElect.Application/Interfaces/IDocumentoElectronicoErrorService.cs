namespace FactElect.Application.Interfaces;

public interface IDocumentoElectronicoErrorService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
