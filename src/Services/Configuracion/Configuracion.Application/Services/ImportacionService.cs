namespace Configuracion.Application.Services;

public interface IImportacionService
{
    Task<ApiResponse> AddAsync(string codImportacion, Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> ValidateAsync(Dictionary<string, object> parameters);
}

public class ImportacionService(IAdoRepository adoRepository) : IImportacionService
{
    public async Task<ApiResponse> AddAsync(string codImportacion, Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>(StoredProcedureDynamic(codImportacion) + "_Insert",
            parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoRepository.GetDataTableAsync("Importaciones.TipoImportacion_Get", parameters);
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "No hay Datos de Importaciones." }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> ValidateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>("Importaciones.Valid_Datos_Get", parameters);
    }

    private static string StoredProcedureDynamic(object cod)
    {
        var storedProcedure = cod switch
        {
            "AR" => "Importaciones.Articulo",
            "AF" => "Importaciones.Fraccionado",
            "SF" => "Importaciones.SubFamilia",
            "ME" => "Importaciones.Medida",
            "MA" => "Importaciones.Marca",
            "MO" => "Importaciones.Modelo",
            "CL" => "Importaciones.Cliente",
            "PR" => "Importaciones.Proveedor",
            _ => ""
        };

        return storedProcedure;
    }
}