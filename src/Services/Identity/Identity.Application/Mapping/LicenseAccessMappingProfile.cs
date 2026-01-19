namespace Identity.Application.Mapping;

public static class LicenseAccessMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping
        config.NewConfig<LicenseAccessCreate, LicenseAccesses>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicenseAccessDetails);

        // Update mapping
        config.NewConfig<LicenseAccessUpdate, LicenseAccesses>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicenseAccessDetails);

        // Create LicenseAccessDetails mapping
        config.NewConfig<LicenseAccessDetailCreate, LicenseAccessDetails>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicenseAccess)
            .Map(dest => dest.MenuId, src => src.SubmenuId);

        // Update LicenseAccessDetails mapping
        config.NewConfig<LicenseAccessDetailUpdate, LicenseAccessDetails>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicenseAccess)
            .Map(dest => dest.MenuId, src => src.SubmenuId);

        // Create LicenseAccessDetails mapping
        config.NewConfig<LicenseAccessDetailDto, LicenseAccessDetails>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicenseAccess);
        // .Ignore(dest => dest.LicenciaAccesoId); // Already matches property name
    }
}
