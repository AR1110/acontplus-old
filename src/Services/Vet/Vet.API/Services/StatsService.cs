namespace Vet.API.Services
{
    public class StatsService(IAdoRepository repository) : IStatsService
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await repository.GetDataSetAsync("Pet.Stats_Get", parameters);
            return DataValidation.DataSetIsNull(ds, true)
                ? new ApiResponse { code = "0", message = "La transacción no devolvio respuesta" }
                : new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
        }
    }
}
