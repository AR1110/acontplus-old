namespace FactElect.Core.Interfaces
{
    public interface IDocumentoElectronicoErrorService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
    }
}
