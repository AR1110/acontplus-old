namespace Ventas.API.Services
{
    public class CreditoGaranteService(IAdoSqlServer _repo):ICreditoGaranteService
    {
        private readonly string nameSp = "Ventas.CreditoGarante_"; 
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        { 
            var ds = await _repo.GetDataSetAsync($"{nameSp}Get", parameters, false, true);

            if (DataValidation.DataSetIsNull(ds))
            {
                return new ApiResponse { Code = "0", Message = "Data not found" };
            }

            return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
        }


        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repo.SpExecuteAsync<ApiResponse>($"{nameSp}Insert", parameters);
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repo.SpExecuteAsync<ApiResponse>($"{nameSp}Update", parameters);
        }
    }
}
