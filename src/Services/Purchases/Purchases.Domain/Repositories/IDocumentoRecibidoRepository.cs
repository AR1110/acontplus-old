namespace Purchases.Domain.Repositories;

public interface IDocumentoRecibidoRepository
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<byte[]> DownloadAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<XmlDocument> GetById(Dictionary<string, object> parameters);
    Task<SpResponse> MigrateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateSubcategoryAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UploadXmlAsync(Dictionary<string, object> parameters);
}
