namespace FactElect.API.Interfaces;

public interface IAtsService
{
    Task<DataSet> GetAts(Dictionary<string, object> parameters);
}
