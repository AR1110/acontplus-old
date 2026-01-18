namespace Configuration.Application.Mapping;

public static class DemoStepMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<DemoStepCreate, DemoStep>()
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.Mandatory, src => src.Mandatory)
            .Map(dest => dest.CreatedByUserId, src => src.CreatedByUserId);

        config.NewConfig<DemoStepUpdate, DemoStep>()
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.Mandatory, src => src.Mandatory)
            .Map(dest => dest.UpdatedByUserId, src => src.UpdatedByUserId);

        config.NewConfig<DemoStep, DemoStepItem>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.Mandatory, src => src.Mandatory)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt);
    }
}