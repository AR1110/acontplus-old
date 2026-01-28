namespace Identity.Application.Mapping;

public static class RoleMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping
        config.NewConfig<RoleCreate, Role>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId);

        // Update mapping
        config.NewConfig<RoleUpdate, Role>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId);

        // Response mappings
        config.NewConfig<Role, RoleItem>();
        config.NewConfig<Role, RoleCreatedResponse>();
    }
}
