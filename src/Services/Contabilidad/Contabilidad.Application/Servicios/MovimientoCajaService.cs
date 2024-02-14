
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;

namespace Contabilidad.Application.Servicios
{
    public class MovimientoCajaService : IMovimientoCajaService
    {
        private readonly IADORepository _repository;
        private readonly ContabilidadContext _context;
        private readonly ApiResponse _response;

        public MovimientoCajaService(IADORepository repository, ContabilidadContext context)
        {
            _repository = repository;
            _context = context;
            _response = new ApiResponse();
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Contabilidad.MovimientoCaja_Get", parameters);
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
            return await _repository.SPExecuteAsync("Contabilidad.MovimientoCaja_Insert", parameters);
        }

        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Contabilidad.MovimientoCaja_Delete", parameters);
        }
    }
}
