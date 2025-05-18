namespace FactElect.Application.Services;

public class DocumentoElectronicoErrorService(IAdoRepository repository) : IDocumentoElectronicoErrorService
{
    public async Task<string> GetAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteDeprecatedAsync("FactElect.Doc_Elect_Error_Get_Id", parameters);
    }
}