namespace Contabilidad.API.Services
{
    public class ComprobanteIngresoService: IComprobanteIngresoService
    {
        private readonly IAdoSqlServer _repository;
        private readonly string nameSchema = "Contabilidad.ComprobanteIngreso_";

        public ComprobanteIngresoService(IAdoSqlServer repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
            if (ds.Tables[0].Rows.Count == 0) { return null; }

            return DataConverters.DataSetToJson(ds, true);

        }
  

        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Insert", parameters);
        }
 

        public async Task<ApiResponse> CancelAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Update_Cancel", parameters);
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Update", parameters);
        }
    }
}
