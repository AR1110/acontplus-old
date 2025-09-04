namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class SerieRepository(TechnicalSupportContext context, IAdoRepository adoRepository)
    : ISerieRepository
{
    public async Task<SpResponse> AddAsync(Serie serie)
    {
        context.Series.Add(serie);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Guardada Exitosamente" };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var serie = await context.Series.FindAsync(id);
        if (serie == null)
            // Handle case where serie not found
            return new SpResponse { Code = "0", Message = "Serie no encontrada" };

        context.Remove(serie);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("TechnicalSupport.Serie_Get", parameters);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new SpResponse { Code = "0", Message = "No data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<SpResponse> UpdateAsync(int id, Serie serie)
    {
        var serieFound = await context.Series.FindAsync(id);
        if (serieFound == null)
            // Handle case where serie not found
            return new SpResponse { Code = "0", Message = "Serie no encontrada" };

        serieFound.BrandId = serie.BrandId;
        serieFound.Code = serie.Code;
        serieFound.IsActive = serie.IsActive;
        serieFound.Name = serie.Name;
        serieFound.UpdatedByUserId = serie.UpdatedByUserId;
        context.Update(serieFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizada Exitosamente" };
    }
}
