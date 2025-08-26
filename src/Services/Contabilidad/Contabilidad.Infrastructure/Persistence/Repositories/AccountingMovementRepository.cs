using Contabilidad.Domain.Repositories;

namespace Contabilidad.Infrastructure.Persistence.Repositories;

public class AccountingMovementRepository(IAdoRepository repository) : IAccountingMovementRepository
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Contabilidad.AccountingMovement_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true)) return new ApiResponse { Code = "0", Message = "Data not found" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
