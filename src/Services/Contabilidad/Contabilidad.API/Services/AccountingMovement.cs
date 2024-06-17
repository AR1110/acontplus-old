namespace Contabilidad.API.Services
{
    public class AccountingMovement(IAdoRepository repository) : IAccountingMovement
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await repository.GetDataSetAsync("Contabilidad.AccountingMovement_Get", parameters);
            if (DataValidation.DataSetIsNull(ds, true))
            {
                return new ApiResponse { code = "0", message = "Data not found" };
            }

            return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
        }
    }
}
