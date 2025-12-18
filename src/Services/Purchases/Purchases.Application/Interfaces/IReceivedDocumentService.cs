namespace Purchases.Application.Interfaces;

public interface IReceivedDocumentService
{
  Task<object> GetAsync(Dictionary<string, object> parameters);
  Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
  Task<object> GetByIdAsync(Dictionary<string, object> parameters);
  Task<XmlDocument> GetByIdXmlAsync(Dictionary<string, object> parameters);
  Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
  Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
  Task<SpResponse> MigrateAsync(Dictionary<string, object> parameters);
  Task<SpResponse> UpdateSubcategoryAsync(Dictionary<string, object> parameters);
  Task<byte[]> DownloadAsync(Dictionary<string, object> parameters);
  Task<SpResponse> UploadXmlAsync(Dictionary<string, object> parameters);
}
