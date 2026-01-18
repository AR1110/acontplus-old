namespace Configuration.Application.Mapping;

public static class LicenciaMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Licencia, LicenciaItem>()
            .Map(dest => dest.Detalles, src => src.LicenciaDetalles);

        config.NewConfig<LicenciaDetalle, LicenciaDetalleItem>();
    }
}