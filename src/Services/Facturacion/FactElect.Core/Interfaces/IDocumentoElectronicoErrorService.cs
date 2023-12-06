namespace FactElect.Core.Interfaces
{
    public interface IDocumentoElectronicoErrorService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
    }
}
