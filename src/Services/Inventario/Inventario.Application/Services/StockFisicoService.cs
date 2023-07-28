using Inventario.Core.Entities;
using Inventario.Core.Interfaces;
using Inventario.Infrastructure.Data;
using Lib.Common;
using Lib.Common.Api;
using System.Data;

namespace Inventario.Application.Services
{
    public class StockFisicoService : IStockFisicoService
    {
        private readonly IADORepository _repository;
        private readonly InventarioContext _context;
        private readonly APIResponse _response;
        public StockFisicoService(IADORepository repository)
        {
            _repository = repository;
            _response = new APIResponse();
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
        public async Task<APIResponse> AddAsync(StockFisico stockFisico)
        {
            _context.StockFisicos.Add(stockFisico);
            await _context.SaveChangesAsync();
            _response.Create(code: "0", message: "Ok");
            return _response;
        }

    }
}
