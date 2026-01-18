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
            .Ignore(dest => dest.Menu)
            .Ignore(dest => dest.Action);

        // Update mapping: MenuActionUpdate -> MenuAction
        config.NewConfig<MenuActionUpdate, MenuAction>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.Menu)
            .Ignore(dest => dest.Action);

        // Response mappings
        config.NewConfig<MenuAction, MenuActionItem>()
            .Map(dest => dest.MenuName, src => src.Menu != null ? src.Menu.Name : string.Empty)
            .Map(dest => dest.ActionName, src => src.Action != null ? src.Action.Name : string.Empty);
    }
}