public class ModeloService : IModeloService
{
    private readonly TechnicalSupportContext _context;
    private readonly IADORepository _repository;

    public ModeloService(TechnicalSupportContext context, IADORepository repository)
    {
        _context = context;
        _repository = repository;
    }

    public async Task<ApiResponse> AddAsync(Modelo modelo)
    {
        modelo.SerieId = modelo.SerieId == 0 ? null : modelo.SerieId;
        _context.Modelos.Add(modelo);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Guardado Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var modelo = await _context.Modelos.FindAsync(id);
        if (modelo == null)
        {
            // Handle case where model not found
            return new ApiResponse { code = "0", message = "Modelo no encontrado" };
        }

        modelo.Enabled = false;
        modelo.Deleted = true;
        modelo.UserId = userId;
        _context.Update(modelo);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Eliminado Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await _repository.GetDataTableAsync("TechnicalSupport.Modelo_Get", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new ApiResponse { code = "0", message = "No data" };
        }

        return new ApiResponse { code = "1", payload = DataConverters.DataTableToJSON(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Modelo modelo)
    {
        var modeloFound = await _context.Modelos.FindAsync(id);
        if (modeloFound == null)
        {
            // Handle case where model not found
            return new ApiResponse { code = "0", message = "Modelo no encontrado" };
        }

        modeloFound.Code = modelo.Code;
        modeloFound.Enabled = modelo.Enabled;
        modeloFound.Name = modelo.Name;
        modeloFound.UserId = modelo.UserId;
        modeloFound.SerieId = modelo.SerieId;
        _context.Update(modeloFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Actualizado Exitosamente" };
    }
}
