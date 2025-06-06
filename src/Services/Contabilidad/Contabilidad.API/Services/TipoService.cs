namespace Contabilidad.API.Services;

public class TipoService : ITipoService
{
    private readonly ContabilidadContext _context;

    public TipoService(ContabilidadContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse> AddAsync(Tipo tipo)
    {
        if (await _context.Tipos.AnyAsync(x => x.Code == tipo.Code))
            return new ApiResponse { Code = "0", Message = "Código ya existe" };

        _context.Tipos.Add(tipo);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrado exitosamente", Payload = tipo };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var tipo = await _context.Tipos.FindAsync(id);
        if (tipo == null) return new ApiResponse { Code = "0", Message = "Tipo no existe" };

        tipo.MarkAsDeleted(userId);
        _context.Update(tipo);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminado exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var tipos = await _context.Tipos.Where(x => x.IsActive == true).ToListAsync();
        if (tipos.Count == 0) return new ApiResponse { Code = "0", Message = "Data no existe" };

        return new ApiResponse
        {
            Code = "1",
            Payload = DataConverters.SerializeObjectCustom<List<Tipo>>(tipos)
        };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Tipo tipo)
    {
        var tipoFound = await _context.Tipos.FindAsync(id);
        if (tipoFound == null) return new ApiResponse { Code = "0", Message = "Tipo no encontrado" };

        tipoFound.Code = tipo.Code;
        tipoFound.Name = tipo.Name;
        tipo.IsActive = tipo.IsActive;
        tipoFound.UpdatedByUserId = tipo.UpdatedByUserId;
        _context.Update(tipoFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente" };
    }
}
