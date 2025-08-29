using System.Data;

namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class ModeloRepository(TechnicalSupportContext context, IAdoRepository adoRepository)
    : IModeloRepository
{
    public async Task<ApiResponse> AddAsync(Modelo modelo)
    {
        modelo.SerieId = modelo.SerieId == 0 ? null : modelo.SerieId;
        context.Modelos.Add(modelo);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Guardado Exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var modelo = await context.Modelos.FindAsync(id);
        if (modelo == null)
            // Handle case where model not found
            return new ApiResponse { Code = "0", Message = "Modelo no encontrado" };

        modelo.MarkAsDeleted(userId);
        context.Update(modelo);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminado Exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("TechnicalSupport.Modelo_Get", parameters, withTableNames: false);
        var dt = ds?.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        return DataValidation.DataTableIsNull(dt)
            ? new ApiResponse { Code = "0", Message = "No data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Modelo modelo)
    {
        var modeloFound = await context.Modelos.FindAsync(id);
        if (modeloFound == null)
            // Handle case where model not found
            return new ApiResponse { Code = "0", Message = "Modelo no encontrado" };

        modeloFound.Code = modelo.Code;
        modeloFound.IsActive = modelo.IsActive;
        modeloFound.Name = modelo.Name;
        modeloFound.UpdatedByUserId = modelo.UpdatedByUserId;
        modeloFound.SerieId = modelo.SerieId;
        context.Update(modeloFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado Exitosamente" };
    }
}
