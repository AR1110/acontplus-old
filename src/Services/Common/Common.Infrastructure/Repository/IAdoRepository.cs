using Common.Core.Models;

namespace Common.Infrastructure.Repository;

public interface IAdoRepository
{
    public Task<List<T>> DynamicListAsync<T>(string spname, Dictionary<string, object> parameters);
    public Task<T> DinamycObjectAsync<T>(string spname, Dictionary<string, object> parameters) where T : class, new();
    public Task<DataSet> GetDataSetAsync(string spname, Dictionary<string, object> parameters, bool oldSp = false);
    public Task<DataTable> GetDataTableAsync(string spname, Dictionary<string, object> parameters);

    public Task<int> OnlyExecuteAsync(string query, Dictionary<string, object> parameters,
        bool useStoredProcedure = true, bool timeout = true);

    public Task<string> SpExecuteDeprecatedAsync(string spname, Dictionary<string, object> parameters,
        bool timeout = true);

    public Task<T> SpExecuteAsync<T>(string spname, Dictionary<string, object> parameters, bool timeout = true) where T : class, new();
}
