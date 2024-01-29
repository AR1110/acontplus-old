using System.Data;

namespace Common.Core.Interfaces
{
    public interface IADORepository
    {
        public Task<List<T>> DynamicListAsync<T>(string spName, Dictionary<string, object> parameters);
        public Task<T> DinamycObjectAsync<T>(string spName, Dictionary<string, object> parameters) where T : class, new();
        public Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters, bool oldSp = false);
        public Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters);
        public Task OnlyExecute(string spName, Dictionary<string, object> parameters);
        public Task<string> SPExecuteAsync(string spName, Dictionary<string, object> parameters);
    }
}
