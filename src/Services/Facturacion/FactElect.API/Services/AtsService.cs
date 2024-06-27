using FactElect.API.Interfaces;

namespace FactElect.API.Services;

public class AtsService(IAdoSqlServer adoSqlServer) : IAtsService
{
    public async Task<DataSet> GetAts(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.GetDataSetAsync("ASPAtsGetData", parameters, true, false);
    }
}
