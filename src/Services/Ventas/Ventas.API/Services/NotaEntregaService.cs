using Common.Core.Interfaces;
using Common.Core.Utils;
using Ventas.API.Interfaces;

namespace Ventas.API.Services
{
    public class NotaEntregaService : INotaEntregaService
    {
        private readonly IADORepository _repository;
        public NotaEntregaService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Ventas.NotaEntrega_Get", parameters, true);
            if (ds.Tables[0].Rows.Count == 0) { return null; }
            return DataConverters.DataSetToJSON(ds, true);
        }
        public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Ventas.NotaEntrega_GetId", parameters, true);
            if (ds.Tables[0].Rows.Count == 0) { return null; }
            return DataConverters.DataSetToJSON(ds, true);
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
