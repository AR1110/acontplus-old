namespace Configuration.Application.Mapping;

public static class LicenseTypeMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping: LicenseTypeCreate -> LicenseType
        config.NewConfig<LicenseTypeCreate, LicenseType>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicensePolicyConfigurations);

        // Update mapping: LicenseTypeUpdate -> LicenseType
        config.NewConfig<LicenseTypeUpdate, LicenseType>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicensePolicyConfigurations);

        // Response mappings
        config.NewConfig<LicenseType, LicenseTypeItem>();
    }
}
