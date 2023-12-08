using System.Data;

namespace Reports.API.Interfaces
{
    public interface IReportService
    {
        Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters);
        Task<DataSet> GetDataAsync(string spname, Dictionary<string, object> parameters, bool legacy = true);
    }
}
