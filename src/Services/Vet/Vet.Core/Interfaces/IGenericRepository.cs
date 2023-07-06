using System.Data;

namespace Vet.Core.Interfaces
{
    public interface IGenericRepository
    {
        public Task<DataTable> GetDataTable(string spName, Dictionary<string, object> parameters);
        public Task<DataSet> GetDataSet(string spName, Dictionary<string, object> parameters);
    }
}
