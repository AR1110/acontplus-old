namespace Compras.Domain.Repositories;

public interface IDocumentoRecibidoRepository
{
  Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
  Task<byte[]> DownloadAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
  Task<XmlDocument> GetById(Dictionary<string, object> parameters);
  Task<ApiResponse> MigrateAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> UpdateSubcategoryAsync(Dictionary<string, object> parameters);
  Task<ApiResponse> UploadXmlAsync(Dictionary<string, object> parameters);
}