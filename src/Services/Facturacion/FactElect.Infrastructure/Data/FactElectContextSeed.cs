using System.Reflection;
using FactElect.Domain.Entities.Sri;
using Newtonsoft.Json;

namespace FactElect.Infrastructure.Data;

public abstract class FactElectContextSeed
{
    public static async Task SeedAsync(FactElectContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.ImpuestosRetencion.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/ImpuestosRetencion.json");
            var impuestos = JsonConvert.DeserializeObject<List<ImpuestoRetencion>>(jsonList);
            context.ImpuestosRetencion.AddRange(impuestos);
        }

        if (!context.TipoComprobantes.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/TipoComprobantes.json");
            var comprobantes = JsonConvert.DeserializeObject<List<TipoComprobante>>(jsonList);
            context.TipoComprobantes.AddRange(comprobantes);
        }

        if (!context.SustentosTributarios.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/SustentosTributarios.json");
            var sustentosTributarios = JsonConvert.DeserializeObject<List<SustentoTributario>>(jsonList);
            context.SustentosTributarios.AddRange(sustentosTributarios);
        }

        if (!context.PorcentajesRetencionIva.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/PorcentajesRetencionIva.json");
            var porcentajes = JsonConvert.DeserializeObject<List<PorcentajeRetencionIva>>(jsonList);
            context.PorcentajesRetencionIva.AddRange(porcentajes);
        }

        if (!context.TiposIdentificacionProveedor.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/TiposIdentificacionProveedor.json");
            var tiposIdentificacionProvedor =
                JsonConvert.DeserializeObject<List<TipoIdentificacionProveedor>>(jsonList);
            context.TiposIdentificacionProveedor.AddRange(tiposIdentificacionProvedor);
        }

        if (!context.TipoPagos.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/TipoPagos.json");
            var tipoPagos =
                JsonConvert.DeserializeObject<List<TipoPago>>(jsonList);
            context.TipoPagos.AddRange(tipoPagos);
        }

        if (!context.ConceptoRetencionAirs.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/ConceptoRetencionAirs.json");
            var conceptos =
                JsonConvert.DeserializeObject<List<ConceptoRetencionAir>>(jsonList);
            context.ConceptoRetencionAirs.AddRange(conceptos);
        }
        if (!context.TiposRegimenFiscalExterior.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/TiposRegimenFiscalExterior.json");
            var regimenes =
                JsonConvert.DeserializeObject<List<TipoRegimenFiscalExterior>>(jsonList);
            context.TiposRegimenFiscalExterior.AddRange(regimenes);
        }
        if (!context.FormasPago.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/FormasPago.json");
            var formasPago =
                JsonConvert.DeserializeObject<List<FormaPago>>(jsonList);
            context.FormasPago.AddRange(formasPago);
        }

        if (context.ChangeTracker.HasChanges())
        {
            await context.SaveChangesAsync();
        }
    }
}
