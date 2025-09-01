namespace Ventas.Application.Services;

public class EmpresaService(IAdoRepository AdoRepository) : IEmpresaService
{
    private const string NameSchema = "Administrador.Empresa_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await AdoRepository.GetDataSetAsync($"{NameSchema}Get", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.SpExecuteAsync<ApiResponse>(NameSchema + "Insert", parameters);
    }


    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.SpExecuteAsync<ApiResponse>(NameSchema + "Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.SpExecuteAsync<ApiResponse>(NameSchema + "Delete", parameters);
    }
}