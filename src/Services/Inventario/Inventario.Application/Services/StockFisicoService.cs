using Inventario.Core.Interfaces;
using Lib.Common;
using System.Data;

namespace Inventario.Application.Services
{
    public class StockFisicoService : IStockFisicoService
    {
        private readonly IADORepository _repository;
        public StockFisicoService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("Inventario.StockFisico_Get", parameters);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                if (ds.Tables.Count > 0)
                {
                    ds = new DataSet();
                }
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }
    }
}
