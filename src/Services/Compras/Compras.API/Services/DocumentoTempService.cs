namespace Compras.API.Services;

public class DocumentoTempService (IADORepository repository) : IDocumentoTempService
{
    public Task<int> AddAsync(Dictionary<string, object> parameters)
    {
        return repository.OnlyExecuteAsync("Recepcion.Doc_Detail_Temp_Insert_All", parameters, timeout: false);
    }
}
