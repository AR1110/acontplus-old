using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;

namespace Contabilidad.Application.Servicios
{
    public class CajaService : ICajaService
    {
        private readonly IADORepository _repository;
        private readonly ContabilidadContext _context;
        private readonly APIResponse _response;

        public CajaService(IADORepository repository, ContabilidadContext context)
        {
            _repository = repository;
            _context = context;
            _response = new APIResponse();
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Contabilidad.Caja_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<object> GetAsigCajaUsuarioAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Contabilidad.", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {   
            return await _repository.SPExecuteAsync("", parameters);
        }

        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("", parameters);
        }

        public async Task<string> DeleteAsync(int id)
        {
            var parameters = new Dictionary<string, object>{                
                {"id", id}
            };
            return await _repository.SPExecuteAsync("", parameters);
        }
    }
}
