namespace FactElect.Application.Interfaces;

public interface IDocumentoElectronicoErrorService
{
    Task<string> GetAsync(Dictionary<string, object> parameters);
}