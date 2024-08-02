namespace FactElect.API.Services;

public class AtsService(IAdoRepository adoRepository) : IAtsService
{
    public async Task<DataSet> GetAts(Dictionary<string, object> parameters)
    {
        return await adoRepository.GetDataSetAsync("ASPAtsGetData", parameters, true, false);
    }
}
