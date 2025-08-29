using System.Data;

namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class SerieRepository(TechnicalSupportContext context, IAdoRepository adoRepository)
    : ISerieRepository
{
    public async Task<ApiResponse> AddAsync(Serie serie)
    {
        context.Series.Add(serie);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Guardada Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var serie = await context.Series.FindAsync(id);
        if (serie == null)
            // Handle case where serie not found
            return new ApiResponse { Code = "0", Message = "Serie no encontrada" };

        context.Remove(serie);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("TechnicalSupport.Serie_Get", parameters, withTableNames: false);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "No data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Serie serie)
    {
        var serieFound = await context.Series.FindAsync(id);
        if (serieFound == null)
            // Handle case where serie not found
            return new ApiResponse { Code = "0", Message = "Serie no encontrada" };

        serieFound.BrandId = serie.BrandId;
        serieFound.Code = serie.Code;
        serieFound.IsActive = serie.IsActive;
        serieFound.Name = serie.Name;
        serieFound.UpdatedByUserId = serie.UpdatedByUserId;
        context.Update(serieFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizada Exitosamente" };
    }
}
