using Acontplus.Core.DTOs.Requests;

namespace Purchases.Infrastructure.Persistence.Repositories;

public class DocumentoTempRepository(IAdoRepository repository) : IDocumentoTempRepository
{
    public Task<int> AddAsync(Dictionary<string, object> parameters)
    {
        var commandOptions = new CommandOptionsDto
        {
            CommandTimeout = 0
        };
        return repository.ExecuteNonQueryAsync("Recepcion.Doc_Detail_Temp_Insert_All", parameters,
            commandOptions);
    }
}
