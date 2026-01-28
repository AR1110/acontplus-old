namespace Configuration.Application.Mapping;

public static class SystemMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Systems, SystemItem>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.DomainUrl, src => src.DomainUrl)
            .Map(dest => dest.IpAddress, src => src.IpAddress)
            .Map(dest => dest.ConnectionStrings, src => src.ConnectionStrings)
            .Map(dest => dest.IsActive, src => src.IsActive)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt)
            .Map(dest => dest.Applications, src => src.Applications);
    }
}
