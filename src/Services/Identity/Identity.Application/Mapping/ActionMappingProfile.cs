namespace Identity.Application.Mapping;

public static class ActionMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ActionCreate, Actions>()
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.CreatedByUserId, src => src.CreatedByUserId);

        config.NewConfig<ActionUpdate, Actions>()
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.UpdatedByUserId, src => src.UpdatedByUserId);

        config.NewConfig<Actions, ActionItem>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt);
    }
}