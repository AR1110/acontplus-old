using System.Reflection;
using System.Text.Json;

namespace FactElect.Infrastructure.Persistence;

public abstract class FactElectContextSeed
{
    public static async Task SeedAsync(FactElectContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        if (!context.ImpuestosRetencion.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/ImpuestosRetencion.json");
            var impuestos = JsonSerializer.Deserialize<List<ImpuestoRetencion>>(jsonList, options);
            context.ImpuestosRetencion.AddRange(impuestos);
        }

        if (!context.TipoComprobantes.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/TipoComprobantes.json");
            var comprobantes = JsonSerializer.Deserialize<List<TipoComprobante>>(jsonList, options);
            context.TipoComprobantes.AddRange(comprobantes);
        }

        if (!context.SustentosTributarios.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/SustentosTributarios.json");
            var sustentos = JsonSerializer.Deserialize<List<SustentoTributario>>(jsonList, options);
            context.SustentosTributarios.AddRange(sustentos);
        }

        if (!context.PorcentajesRetencionIva.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/PorcentajesRetencionIva.json");
            var porcentajes = JsonSerializer.Deserialize<List<PorcentajeRetencionIva>>(jsonList, options);
            context.PorcentajesRetencionIva.AddRange(porcentajes);
        }

        if (!context.TiposIdentificacionProveedor.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/TiposIdentificacionProveedor.json");
            var tiposIdentificacion = JsonSerializer.Deserialize<List<TipoIdentificacionProveedor>>(jsonList, options);
            context.TiposIdentificacionProveedor.AddRange(tiposIdentificacion);
        }

        if (!context.TipoPagos.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/TipoPagos.json");
            var tiposPago = JsonSerializer.Deserialize<List<TipoPago>>(jsonList, options);
            context.TipoPagos.AddRange(tiposPago);
        }

        if (!context.TiposRegimenFiscalExterior.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/TiposRegimenFiscalExterior.json");
            var regimenes = JsonSerializer.Deserialize<List<TipoRegimenFiscalExterior>>(jsonList, options);
            context.TiposRegimenFiscalExterior.AddRange(regimenes);
        }

        if (!context.FormasPago.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/FormasPago.json");
            var formasPago = JsonSerializer.Deserialize<List<FormaPago>>(jsonList, options);
            context.FormasPago.AddRange(formasPago);
        }

        if (context.ChangeTracker.HasChanges())
            await context.SaveChangesAsync();
    }
}
