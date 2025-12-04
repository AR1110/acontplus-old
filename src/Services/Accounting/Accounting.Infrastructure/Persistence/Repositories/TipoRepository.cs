namespace Accounting.Infrastructure.Persistence.Repositories;

public class TipoRepository : ITipoRepository
{
    private readonly AccountingContext _context;

    public TipoRepository(AccountingContext context)
    {
        _context = context;
    }

    public async Task<SpResponse> AddAsync(Tipo tipo)
    {
        if (await _context.Tipos.AnyAsync(x => x.Code == tipo.Code))
            return new SpResponse { Code = "0", Message = "Código ya existe" };

        _context.Tipos.Add(tipo);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrado exitosamente", Payload = tipo };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var tipo = await _context.Tipos.FindAsync(id);
        if (tipo == null) return new SpResponse { Code = "0", Message = "Tipo no existe" };

        tipo.MarkAsDeleted(userId);
        _context.Update(tipo);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminado exitosamente" };
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var tipos = await _context.Tipos.AsNoTracking().Where(x => x.IsActive == true).ToListAsync();
        return tipos.Count == 0
            ? new SpResponse { Code = "0", Message = "Data no existe" }
            : new SpResponse
            {
                Code = "1",
                Payload = DataConverters.SerializeObjectCustom<List<Tipo>>(tipos)
            };
    }

    public async Task<SpResponse> UpdateAsync(int id, Tipo tipo)
    {
        var tipoFound = await _context.Tipos.FindAsync(id);
        if (tipoFound == null) return new SpResponse { Code = "0", Message = "Tipo no encontrado" };

        tipoFound.Code = tipo.Code;
        tipoFound.Name = tipo.Name;
        tipo.IsActive = tipo.IsActive;
        tipoFound.UpdatedByUserId = tipo.UpdatedByUserId;
        _context.Update(tipoFound);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado exitosamente" };
    }
}
