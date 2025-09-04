namespace Configuracion.Application.Services;

public interface IImportacionService
{
    Task<SpResponse> AddAsync(string codImportacion, Dictionary<string, object> parameters);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> ValidateAsync(Dictionary<string, object> parameters);
}

public class ImportacionService(IAdoRepository adoRepository) : IImportacionService
{
    public async Task<SpResponse> AddAsync(string codImportacion, Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>(StoredProcedureDynamic(codImportacion) + "_Insert",
            parameters);
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Importaciones.TipoImportacion_Get", parameters);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "No hay Datos de Importaciones." }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<SpResponse> ValidateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Importaciones.Valid_Datos_Get", parameters);
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
