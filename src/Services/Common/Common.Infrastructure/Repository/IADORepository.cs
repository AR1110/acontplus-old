using System.Data;

namespace Common.Infrastructure.Repository
{
    public interface IADORepository
    {
        public Task<DataTable> GetDataTableAsync(string contextName, string spName, Dictionary<string, object> parameters);
        public Task<DataSet> GetDataSetAsync(string contextName, string spName, Dictionary<string, object> parameters);
        public Task<string> SPExecuteAsync(string contextName, string spName, Dictionary<string, object> parameters);
    }
}
