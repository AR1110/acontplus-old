using System.Data;
using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface IADOSqlServer
    {
        public Task<List<T>> DynamicListAsync<T>(string spname, Dictionary<string, object> parameters);
        public Task<T> DinamycObjectAsync<T>(string spname, Dictionary<string, object> parameters) where T : class, new();
        public Task<DataSet> GetDataSetAsync(string spname, Dictionary<string, object> parameters, bool oldSp = false);
        public Task<DataTable> GetDataTableAsync(string spname, Dictionary<string, object> parameters);
        public Task<int> OnlyExecute(string query, Dictionary<string, object> parameters, bool useStoredProcedure = true);
        public Task<ApiResponse> SPExecuteAsync(string spname, Dictionary<string, object> parameters);
    }
}
