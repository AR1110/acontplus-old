using System.Data;

namespace Inventario.Core.Interfaces
{
    public interface IADORepository
    {
        public Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters);
        public Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters);
        public Task<string> SPExecuteAsync(string spName, Dictionary<string, object> parameters);
    }
}
