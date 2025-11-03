namespace Configuration.Application.Services;

public class CompanyService : ICompanyService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Config.Company_";

    public CompanyService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
        return ds.Tables.Count == 0 ? null : (object)DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "Update", parameters);
    }
}
