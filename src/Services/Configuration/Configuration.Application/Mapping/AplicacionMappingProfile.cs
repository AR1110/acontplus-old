namespace Configuration.Application.Mapping;

public static class AplicacionMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Aplicacion, AplicacionItem>()
            .Map(dest => dest.SistemaName, src => src.Sistema != null ? src.Sistema.Name : string.Empty);
    }
}
