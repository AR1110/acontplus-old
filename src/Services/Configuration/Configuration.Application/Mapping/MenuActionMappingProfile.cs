namespace Configuration.Application.Mapping;

public static class MenuActionMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping: MenuActionCreate -> MenuAction
        config.NewConfig<MenuActionCreate, MenuAction>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.Menu);

        // Update mapping: MenuActionUpdate -> MenuAction
        config.NewConfig<MenuActionUpdate, MenuAction>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.Menu);

        // Response mappings
        // Note: ActionName must be populated separately - Action is in Identity service
        config.NewConfig<MenuAction, MenuActionItem>()
            .Map(dest => dest.MenuName, src => src.Menu != null ? src.Menu.Name : string.Empty)
            .Map(dest => dest.ActionName, src => string.Empty);
    }
}
