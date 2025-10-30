namespace Configuration.Infrastructure.Persistence.Repositories;

public class EstablecimientoLogoRepository : IEstablecimientoLogoRepository
{
    private readonly ConfigurationContext _context;

    public EstablecimientoLogoRepository(ConfigurationContext context)
    {
        _context = context;
    }

    public async Task<object> AddAsync(EstablecimientoLogo data)
    {
        data.IsCompressed = true;
        data.LatestVersion = 1;
        await _context.AddAsync(data);
        await _context.SaveChangesAsync();
        return new { code = "1", message = "Guardado Exitosamente" };
    }

    public async Task<object> DeleteAsync(int id)
    {
        var logo = await _context.EstablecimientoLogos.FindAsync(id);
        if (logo == null) return null;
        _context.Remove(logo);
        await _context.SaveChangesAsync();
        return new { code = "1", message = "Eliminado Exitosamente" };
    }

    public async Task<EstablecimientoLogo> GetAsync(int establecimientoId)
    {
        var logo =
            await _context.EstablecimientoLogos.FirstOrDefaultAsync(x => x.EstablecimientoId == establecimientoId);
        if (logo == null) return null;

        if (logo.IsCompressed == true) logo.Content = CompressionUtils.DecompressGZip(logo.Content);

        return logo;
    }

    public async Task<object> UpdateAsync(int id, EstablecimientoLogo data)
    {
        var logo = await _context.EstablecimientoLogos.FindAsync(id);
        if (logo == null) return null;

        ;
        logo.Content = data.Content;
        logo.ContentType = data.ContentType;
        logo.IsCompressed = true;
        logo.LatestVersion = data.LatestVersion + 1;
        logo.UpdatedByUserId = data.UpdatedByUserId;
        _context.Update(logo);
        await _context.SaveChangesAsync();
        return new { code = "1", message = "Actualizado Exitosamente" };
    }
}
