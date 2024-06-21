public class ModeloService : IModeloService
{
    private readonly TechnicalSupportContext _context;
    private readonly IAdoSqlServer _adoSqlServer;

    public ModeloService(TechnicalSupportContext context, IAdoSqlServer adoSqlServer)
    {
        _context = context;
        _adoSqlServer = adoSqlServer;
    }

    public async Task<ApiResponse> AddAsync(Modelo modelo)
    {
        modelo.SerieId = modelo.SerieId == 0 ? null : modelo.SerieId;
        _context.Modelos.Add(modelo);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Guardado Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var modelo = await _context.Modelos.FindAsync(id);
        if (modelo == null)
        {
            // Handle case where model not found
            return new ApiResponse { Code = "0", Message = "Modelo no encontrado" };
        }

        modelo.Enabled = false;
        modelo.Deleted = true;
        modelo.UserId = userId;
        _context.Update(modelo);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminado Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await _adoSqlServer.GetDataTableAsync("TechnicalSupport.Modelo_Get", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new ApiResponse { Code = "0", Message = "No data" };
        }

        return new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Modelo modelo)
    {
        var modeloFound = await _context.Modelos.FindAsync(id);
        if (modeloFound == null)
        {
            // Handle case where model not found
            return new ApiResponse { Code = "0", Message = "Modelo no encontrado" };
        }

        modeloFound.Code = modelo.Code;
        modeloFound.Enabled = modelo.Enabled;
        modeloFound.Name = modelo.Name;
        modeloFound.UserId = modelo.UserId;
        modeloFound.SerieId = modelo.SerieId;
        _context.Update(modeloFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado Exitosamente" };
    }
}
