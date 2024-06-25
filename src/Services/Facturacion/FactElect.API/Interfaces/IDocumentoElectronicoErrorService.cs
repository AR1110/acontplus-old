namespace FactElect.API.Interfaces;

public interface IDocumentoElectronicoErrorService
{
    Task<string> GetAsync(Dictionary<string, object> parameters);
}
