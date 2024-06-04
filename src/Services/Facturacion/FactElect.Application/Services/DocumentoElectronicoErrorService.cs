using Common.Core.Interfaces;
using FactElect.Core.Interfaces;

namespace FactElect.Application.Services;

public class DocumentoElectronicoErrorService : IDocumentoElectronicoErrorService
{
    private readonly IAdoRepository _repository;

    public DocumentoElectronicoErrorService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> GetAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("FactElect.Doc_Elect_Error_Get_Id", parameters);
    }
}
