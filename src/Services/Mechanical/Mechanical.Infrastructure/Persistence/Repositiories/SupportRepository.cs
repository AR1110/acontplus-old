namespace Mechanical.Infrastructure.Persistence.Repositiories;

public class SupportRepository(MechanicalContext _context, IAdoRepository _repository) : ISupportRepository
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Mechanical.Support_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Mechanical.Support_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Mechanical.Support_Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Mechanical.Support_Delete", parameters);
    }

    public async Task<SpResponse> UpdateStateAsync(int id, int SupportStatusId)
    {
        var support = await _context.Supports.FindAsync(id);
        if (support == null) return new SpResponse { Code = "0", Message = "No se encontro Orden para actualizar" };
        support.SupportStatusId = SupportStatusId;
        _context.Update(support);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado exitosamente", Payload = null };
    }
}
