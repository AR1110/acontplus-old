namespace Contabilidad.API.Repositories;

public class CajaRepository(IAdoRepository adoRepository) : ICajaRepository
{
    private const string NameSchema = "Contabilidad.Caja_";

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

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{NameSchema}Delete", parameters);
    }
}
