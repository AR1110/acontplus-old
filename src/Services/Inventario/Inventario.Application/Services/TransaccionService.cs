using Common.Core.Interfaces;
using Common.Core.Utils;
using Inventario.Core.Interfaces;

namespace Inventario.Application.Services
{
    public class TransaccionService : ITransaccionService
    {
        private readonly IADORepository _repository;
        private readonly string nameSchema = "Inventario.Transaccion";
        public TransaccionService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }
        public void Process(Dictionary<string, object> parameters)
        {
            _repository.OnlyExecuteAsync("dbo.Transaccion_Handler_Init", parameters);
        }
    }
}
