namespace Compras.API.Services;

public class DocumentoTempService(IAdoRepository repository) : IDocumentoTempService
{
    public Task<int> AddAsync(Dictionary<string, object> parameters)
    {
        return repository.ExecuteNonQueryAsync("Recepcion.Doc_Detail_Temp_Insert_All", parameters,
            disableTimeout: true);
    }
}