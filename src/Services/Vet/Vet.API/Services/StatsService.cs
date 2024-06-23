namespace Vet.API.Services
{
    public class StatsService(IAdoSqlServer repository) : IStatsService
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await repository.GetDataSetAsync("Vet.Stats_Get", parameters);
            return DataValidation.DataSetIsNull(ds, true)
                ? new ApiResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
                : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
        }
    }
}
