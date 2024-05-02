public class SerieService : ISerieService
{
    private readonly TechnicalSupportContext _context;
    private readonly IADORepository _repository;

    public SerieService(TechnicalSupportContext context, IADORepository repository)
    {
        _context = context;
        _repository = repository;
    }

    public async Task<ApiResponse> AddAsync(Serie serie)
    {
        if (await _context.Series.AnyAsync(x => x.Code == serie.Code))
        {
            return new ApiResponse { code = "0", message = "Este código ya se encuentra registrado" };
        }

        _context.Series.Add(serie);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Guardada Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var serie = await _context.Series.FindAsync(id);
        if (serie == null)
        {
            // Handle case where serie not found
            return new ApiResponse { code = "0", message = "Serie no encontrada" };
        }

        serie.Enabled = false;
        serie.Deleted = true;
        serie.UserId = userId;
        _context.Update(serie);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Eliminada Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await _repository.GetDataTableAsync("TechnicalSupport.Serie_Get", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new ApiResponse { code = "0", message = "No data" };
        }
        return new ApiResponse { code = "1", payload = DataConverters.DataTableToJSON(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Serie serie)
    {
        var serieFound = await _context.Series.FindAsync(id);
        if (serieFound == null)
        {
            // Handle case where serie not found
            return new ApiResponse { code = "0", message = "Serie no encontrada" };
        }

        serieFound.BrandId = serie.BrandId;
        serieFound.Code = serie.Code;
        serieFound.Enabled = serie.Enabled;
        serieFound.Name = serie.Name;
        serieFound.UserId = serie.UserId;
        _context.Update(serieFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Actualizada Exitosamente" };
    }
}
