namespace Contabilidad.API.Services
{
    public class ChequeService : IChequeService
    {
        private readonly IADORepository _repository;

        public ChequeService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Contabilidad.Cheque_Get", parameters);
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
            return await _repository.SPExecuteDeprecatedAsync("Contabilidad.Caja_Insert", parameters);
        }

        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteDeprecatedAsync("Contabilidad.Caja_Update", parameters);
        }

        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteDeprecatedAsync("Contabilidad.Caja_Delete", parameters);
        }
    }
}
