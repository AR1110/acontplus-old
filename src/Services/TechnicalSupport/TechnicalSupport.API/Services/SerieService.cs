namespace TechnicalSupport.API.Services;

public class SerieService : ISerieService
{
    private readonly IAdoRepository _adoRepository;
    private readonly TechnicalSupportContext _context;

    public SerieService(TechnicalSupportContext context, IAdoRepository adoRepository)
    {
        _context = context;
        _adoRepository = adoRepository;
    }

    public async Task<ApiResponse> AddAsync(Serie serie)
    {
        _context.Series.Add(serie);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Guardada Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var serie = await _context.Series.FindAsync(id);
        if (serie == null)
            // Handle case where serie not found
            return new ApiResponse { Code = "0", Message = "Serie no encontrada" };

        serie.IsActive = false;
        serie.IsDeleted = true;
        serie.UserId = userId;
        _context.Update(serie);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await _adoRepository.GetDataTableAsync("TechnicalSupport.Serie_Get", parameters);
        if (DataValidation.DataTableIsNull(dt)) return new ApiResponse { Code = "0", Message = "No data" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Serie serie)
    {
        var serieFound = await _context.Series.FindAsync(id);
        if (serieFound == null)
            // Handle case where serie not found
            return new ApiResponse { Code = "0", Message = "Serie no encontrada" };

        serieFound.BrandId = serie.BrandId;
        serieFound.Code = serie.Code;
        serieFound.IsActive = serie.IsActive;
        serieFound.Name = serie.Name;
        serieFound.UserId = serie.UserId;
        _context.Update(serieFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizada Exitosamente" };
    }
}