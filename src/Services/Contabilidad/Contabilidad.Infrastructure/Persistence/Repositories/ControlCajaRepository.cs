using Contabilidad.Domain.Repositories;

namespace Contabilidad.Infrastructure.Persistence.Repositories;

public class ControlCajaRepository(IAdoRepository adoRepository) : IControlCajaRepository
{
    private const string NameSchema = "Contabilidad.ControlCaja_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{NameSchema}Get", parameters);
        return ds.Tables.Count == 0
            ? new ApiResponse { Code = "0", Message = "No data found." }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{NameSchema}Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{NameSchema}Update", parameters);
    }

    public Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException("Delete operation is not implemented yet.");
    }
}
