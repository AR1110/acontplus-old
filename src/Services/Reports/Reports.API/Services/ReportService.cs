namespace Reports.API.Services;
public interface IReportService
{
    Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters );
    Task<DataSet> GetDataAsync(string spname, Dictionary<string, object> parameters , bool withTableNames = false);
}
public class ReportService(IAdoSqlServer adoSqlServer) : IReportService
{
    public async Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters  )
    {
        return await adoSqlServer.GetDataSetAsync("Reporte.Report_Get", parameters);
    }
    public async Task<DataSet> GetDataAsync(string spname, Dictionary<string, object> parameters, bool withTableNames)
    {
        return await adoSqlServer.GetDataSetAsync(spname, parameters, withTableNames, false);
    }
}
