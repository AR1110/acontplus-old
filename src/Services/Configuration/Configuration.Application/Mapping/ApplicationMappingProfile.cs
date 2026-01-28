namespace Configuration.Application.Mapping;

public static class ApplicationMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Applications, ApplicationItem>()
            .Map(dest => dest.SystemName, src => src.System != null ? src.System.Name : string.Empty)
            .Map(dest => dest.SystemId, src => src.SystemId);
    }
}
