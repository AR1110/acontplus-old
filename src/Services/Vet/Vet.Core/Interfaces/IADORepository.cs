using System.Data;

namespace Vet.Core.Interfaces
{
    public interface IADORepository
    {
        public Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters);
        public Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters);
    }
}
