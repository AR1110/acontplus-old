namespace Billing.Application.Interfaces;

public interface IDocumentoElectronicoService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetByStatusAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetDataFormAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetFiltersAsync(Dictionary<string, object> parameters);
    Task<FileModel> GetXmlSriAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
