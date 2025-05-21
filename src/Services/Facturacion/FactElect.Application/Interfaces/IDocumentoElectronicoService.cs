namespace FactElect.Application.Interfaces;

public interface IDocumentoElectronicoService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetByStatusAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetDataFormAsync(Dictionary<string, object> parameters);
    Task<FileModel> GetXmlSriAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}