namespace Compras.API.Services;

public class DocRecDetailTempService(IAdoRepository adoRepository) : IDocRecDetailTempService
{
  private const string ModuleName = "Recepcion.Doc_Detail_Temp_";

  public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
  {
    return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
  }

  public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
  {
    var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, withTableNames: false);
    var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
    return DataValidation.DataTableIsNull(dt)
        ? new ApiResponse { Code = "0", Message = "Recurso no encontrado" }
        : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
  }

  public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
  {
    return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
  }
}