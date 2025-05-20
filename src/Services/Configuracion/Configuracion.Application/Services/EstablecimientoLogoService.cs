namespace Configuracion.Application.Services;

public class EstablecimientoLogoService : IEstablecimientoLogoService
{
    private readonly ConfigContext _context;

    public EstablecimientoLogoService(ConfigContext context)
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

        if (logo.IsCompressed == true) logo.Content = CompressionUtils.DecompressDeflate(logo.Content);

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
        _context.Update(logo);
        await _context.SaveChangesAsync();
        return new { code = "1", message = "Actualizado Exitosamente" };
    }
}