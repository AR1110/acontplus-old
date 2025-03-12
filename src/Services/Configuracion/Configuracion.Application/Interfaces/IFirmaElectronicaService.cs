namespace Configuracion.Application.Interfaces;

public interface IFirmaElectronicaService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<FileModel> DownloadAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateFileAsync(Dictionary<string, object> parameters);
}
