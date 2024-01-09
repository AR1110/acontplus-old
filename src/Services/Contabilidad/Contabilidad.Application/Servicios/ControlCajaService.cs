using Common.Core.Interfaces;
using Common.Core.Utils;
using Contabilidad.Core.Interfaces;

namespace Contabilidad.Application.Servicios
{
    public class ControlCajaService : IControlCajaService
    {
        private readonly IADORepository _repository;

        public ControlCajaService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("", parameters);
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

        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {            
            return await _repository.SPExecuteAsync("", parameters);
        }
    }
}
