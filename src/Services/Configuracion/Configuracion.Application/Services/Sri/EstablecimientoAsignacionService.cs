namespace Configuracion.Application.Services.Sri;

public class EstablecimientoAsignacionService(IAdoRepository repository) : IEstablecimientoAsignacionService
{
  public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
  {
    var ds = await repository.GetDataSetAsync("Config.Estab_Asig_Get", parameters, withTableNames: false);
    var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
    return !DataValidation.DataTableIsNull(dt)
        ? new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) }
        : new ApiResponse { Code = "0", Message = "Not found" };
  }

  public async Task<ApiResponse> GetDataFormAsync(Dictionary<string, object> parameters)
  {
    var ds = await repository.GetDataSetAsync("Config.Estab_Asig_Get_Data_Form", parameters, false);
    return DataValidation.DataSetIsNull(ds)
        ? new ApiResponse { Code = "0", Message = "No Data" }
        : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) };
  }

  public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
  {
    return await repository.SpExecuteAsync<ApiResponse>("Config.Estab_Asig_Insert", parameters);
  }

  public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
  {
    return await repository.SpExecuteAsync<ApiResponse>("Config.Estab_Asig_Update", parameters);
  }
}