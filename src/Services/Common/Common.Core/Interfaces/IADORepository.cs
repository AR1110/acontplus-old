using System.Data;
using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface IADORepository
    {
        public Task<List<T>> DynamicListAsync<T>(string spName, Dictionary<string, object> parameters);
        public Task<T> DinamycObjectAsync<T>(string spName, Dictionary<string, object> parameters) where T : class, new();
        public Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters, bool oldSp = false);
        public Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters);
        public Task<int> OnlyExecuteAsync(string query, Dictionary<string, object> parameters, bool useStoredProcedure = true);
        public Task<string> SPExecuteDeprecatedAsync(string spName, Dictionary<string, object> parameters, bool timeout = true);
        public Task<ApiResponse> SPExecuteAsync(string spName, Dictionary<string, object> parameters, bool timeout = true);
    }
}
