namespace Configuration.Application.Mapping;

public static class MenuMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping: MenuCreate -> Menu
        config.NewConfig<MenuCreate, Menu>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.Application)
            .Ignore(dest => dest.Parent)
            .Ignore(dest => dest.Children)
            .Ignore(dest => dest.MenuActions);

        // Update mapping: MenuUpdate -> Menu
        config.NewConfig<MenuUpdate, Menu>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.Application)
            .Ignore(dest => dest.Parent)
            .Ignore(dest => dest.Children)
            .Ignore(dest => dest.MenuActions);

        // Response mappings
        config.NewConfig<Menu, MenuItem>()
            .Map(dest => dest.ApplicationName, src => src.Application != null ? src.Application.Name : string.Empty)
            .Map(dest => dest.ParentName, src => src.Parent != null ? src.Parent.Name : null)
            .Map(dest => dest.Children, src => src.Children);
    }
}
