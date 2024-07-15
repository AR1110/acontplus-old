 

namespace Contabilidad.API.Services
{
    public class SolicitudCreditoService(IAdoRepository _repo):ISolicitudCreditoService
    {
        private readonly string nameSp = "Contabilidad.SolicitudCredito_";
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            ApiResponse response = new ApiResponse();
            var ds = await _repo.GetDataSetAsync($"{nameSp}Get", parameters, false, true);

            if (DataValidation.DataSetIsNull(ds, true))
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
