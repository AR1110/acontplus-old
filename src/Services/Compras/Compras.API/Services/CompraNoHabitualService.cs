using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Compras.API.Interfaces;

namespace Compras.API.Services
{
    public class CompraNoHabitualService : ICompraNoHabitualService
    {
        private readonly IADORepository _repository;
        public CompraNoHabitualService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Compra.Documento_Ingreso_Get", parameters);
            if (ds.Tables[0].Rows.Count == 0) { return null; }
            return DataConverters.DataSetToJSON(ds);
        }

        public async Task<string> AddAsync(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Recepcion.CompraHabitual_Insert", parameters);

        }

        //public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
        //{
        //    var ds = await _repository.GetDataSetAsync("Compra.Liquidacion_Get_Id", parameters, true);
        //    if (ds.Tables[0].Rows.Count == 0) { return null; }
        //    return DataConverters.DataSetToJSON(ds, true);
        //}

        public async Task<string> UpdateAsync(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"id", id},
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Recepcion.CompraHabitual_Update", parameters);

        }

        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Recepcion.CompraHabitual_Delete", parameters);

        }
    }
}
