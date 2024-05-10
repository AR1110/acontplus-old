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
        {
            return new ApiResponse { code = "0", message = "Código ya existe" };
        }

        _context.Tipos.Add(tipo);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Registrado exitosamente", payload = tipo };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var tipo = await _context.Tipos.FindAsync(id);
        if (tipo == null)
        {
            return new ApiResponse { code = "0", message = "Tipo no existe" };
        }

        tipo.Enabled = false;
        tipo.Deleted = true;
        tipo.UserId = userId;
        _context.Update(tipo);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Eliminado exitosamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var tipos = await _context.Tipos.Where(x => x.Enabled == true).ToListAsync();
        if (tipos.Count == 0)
        {
            return new ApiResponse { code = "0", message = "Data no existe" };
        }

        return new ApiResponse { code = "1", payload = DataConverters.SerializeObjectCustom<List<Tipo>>(tipos) };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Tipo tipo)
    {
        var tipoFound = await _context.Tipos.FindAsync(id);
        if (tipoFound == null)
        {
            return new ApiResponse { code = "0", message = "Tipo no encontrado" };
        }

        tipoFound.Code = tipo.Code;
        tipoFound.Name = tipo.Name;
        tipo.Enabled = tipo.Enabled;
        tipoFound.UserId = tipo.UserId;
        _context.Update(tipoFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { code = "1", message = "Actualizado exitosamente" };
    }
}
