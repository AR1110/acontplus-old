namespace Reports.API.Services;

public class ReportService(IAdoRepository AdoRepository) : IReportService
{
    public async Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.GetDataSetAsync("Reporte.Report_Get", parameters);
    }
    public async Task<DataSet> GetDataAsync(string spname, Dictionary<string, object> parameters, bool withTableNames)
    {
        return await AdoRepository.GetDataSetAsync(spname, parameters, withTableNames, false);
    }
}
