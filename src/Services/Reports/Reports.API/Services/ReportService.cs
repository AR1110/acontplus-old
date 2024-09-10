namespace Reports.API.Services;
public interface IReportService
{
    Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters, string connectionString);
    Task<DataSet> GetDataAsync(string spname, Dictionary<string, object> parameters, string connectionString, bool legacy = true);
}
public class ReportService(IAdoSqlServer adoSqlServer) : IReportService
{
    public async Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters, string connectionString)
    {
        return await adoSqlServer.GetDataSetAsync("Reporte.Report_Get", parameters);
    }
    public async Task<DataSet> GetDataAsync(string spname, Dictionary<string, object> parameters, string connectionString, bool legacy)
    {
        return await adoSqlServer.GetDataSetAsync(spname, parameters, legacy, false);
    }
}
