namespace Configuracion.Application.Interfaces;

public interface IFirmaElectronicaService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<FileModel> DownloadAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateFileAsync(Dictionary<string, object> parameters);
}
