using System.Data;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;

namespace Contabilidad.Application.Servicios
{
    public class CajaMovimientoService : ICajaMovimientoInterface
    {
        private readonly IADORepository _repository;
        private readonly ContabilidadContext _context;
        private readonly APIResponse _response;

        public CajaMovimientoService(IADORepository repository, ContabilidadContext context)
        {
            _repository = repository;
            _context = context;
            _response = new APIResponse();
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Contabilidad.CajaMovimiento_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<string> AddAsync(ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                    {"userRoleId", data.UserRoleId},
                    {"json", DataConverters.SerializeDictionary(data.Data)}
                };
            var response = await _repository.SPExecuteAsync("Contabilidad.CajaMovimiento_Insert", parameters);
            return response;
        }
        public async Task<string> UpdateAsync(int id, ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", data.UserRoleId},
                {"id", id},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
            };
            var response = await _repository.SPExecuteAsync("Contabilidad.CajaMovimiento_Update", parameters);
            return response;
        }
    }
}
