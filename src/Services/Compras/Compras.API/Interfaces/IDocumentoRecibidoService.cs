namespace Compras.API.Interfaces;

public interface IDocumentoRecibidoService
{
    Task<ApiResponse> AddAsync(ApiRequest request);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<byte[]> DownloadAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<XmlDocument> GetById(Dictionary<string, object> parameters);
    Task<string> UpdateAsync(int id, ApiRequest request);
    Task<ApiResponse> UploadXml(Dictionary<string, object> parameters);
}
