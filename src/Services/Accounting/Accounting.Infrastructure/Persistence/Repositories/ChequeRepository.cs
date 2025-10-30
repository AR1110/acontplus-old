namespace Accounting.Infrastructure.Persistence.Repositories;

public class ChequeRepository(IAdoRepository adoRepository) : IChequeRepository
{
    private const string NameSchema = "Contabilidad.Cheque_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{NameSchema}Get", parameters);
        return ds.Tables.Count == 0
            ? new SpResponse { Code = "0", Message = "No data found." }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
