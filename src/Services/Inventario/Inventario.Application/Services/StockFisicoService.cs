using System.Data;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Inventario.Core.Interfaces;

namespace Inventario.Application.Services
{
    public class StockFisicoService : IStockFisicoService
    {
        private readonly IADORepository _repository;
        private readonly ApiResponse _response;
        public StockFisicoService(IADORepository repository)
        {
            _repository = repository;
            _response = new ApiResponse();
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
                return DataConverters.DataSetToJSON(ds);
            }
        }
        public async Task<string> AddAsync(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Inventario.StockFisico_Insert", parameters);
        }

        public async Task<string> UpdateAsync(int id, ApiRequest request)
        {
            // _context.StockFisicos.Add(stockFisico);
            // await _context.SaveChangesAsync(); 
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Inventario.StockFisico_Update", request.Data);
        }
        public async Task<ApiResponse> DeleteAsync(int id)
        {
            // _context.StockFisicos.Add(stockFisico);
            // await _context.SaveChangesAsync(); 
            var dt = await _repository.GetDataTableAsync("Inventario.StockFisico_Delete", null);
            if (!DataValidation.DataTableIsNull(dt))
            {
                _response.Create(code: "1", payload: DataTableMapper.BindData<ApiResponse>(dt));
            }
            else
            {
                _response.Create(code: "0", message: "La transacción no devolvio respuesta");
            }
            return _response;
        }
    }
}
