namespace Accounting.Infrastructure.Persistence.Repositories;

public class AccountingMovementRepository(IAdoRepository repository) : IAccountingMovementRepository
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Contabilidad.AccountingMovement_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
