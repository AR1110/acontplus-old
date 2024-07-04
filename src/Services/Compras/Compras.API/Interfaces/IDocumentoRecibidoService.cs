namespace Compras.API.Interfaces;

public interface IDocumentoRecibidoService
{
    Task<ApiResponse> AddAsync(ApiRequest request);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<byte[]> DownloadAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<XmlDocument> GetById(Dictionary<string, object> parameters);
    Task<ApiResponse> MigrateAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(int id, ApiRequest request);
    Task<ApiResponse> UpdateSubcategoryAsync(ApiRequest request);
    Task<ApiResponse> UploadXmlAsync(Dictionary<string, object> parameters);
}
