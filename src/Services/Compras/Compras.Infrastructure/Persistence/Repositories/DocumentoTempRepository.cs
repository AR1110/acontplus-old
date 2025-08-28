namespace Compras.Infrastructure.Persistence.Repositories;

public class DocumentoTempRepository(IAdoRepository repository) : IDocumentoTempRepository
{
    public Task<int> AddAsync(Dictionary<string, object> parameters)
    {
        return repository.ExecuteNonQueryAsync("Recepcion.Doc_Detail_Temp_Insert_All", parameters,
            disableTimeout: true);
    }
}