namespace Contabilidad.API.Services
{
    public class ComprobanteIngresoService: IComprobanteIngresoService
    {
        private readonly IAdoRepository _repository;
        private readonly string nameSchema = "Contabilidad.ComprobanteIngreso_";

        public ComprobanteIngresoService(IAdoRepository repository)
        {
            _repository = repository;
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        { 

            var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return new ApiResponse { Code = "1", Message = "No existen datos." };
            }

            return new ApiResponse
            {
                Code = "1",
                Payload = DataConverters.DataSetToJson(ds)
            };

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
