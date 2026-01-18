namespace Configuration.Application.Mapping;

public static class PolicyTypeMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping: PolicyTypeCreate -> PolicyType
        config.NewConfig<PolicyTypeCreate, PolicyType>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicensePolicyConfigurations)
            .Ignore(dest => dest.CompanyPolicyOverrides);

        // Update mapping: PolicyTypeUpdate -> PolicyType
        config.NewConfig<PolicyTypeUpdate, PolicyType>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.LicensePolicyConfigurations)
            .Ignore(dest => dest.CompanyPolicyOverrides);

        // Response mappings
        config.NewConfig<PolicyType, PolicyTypeItem>();
    }
}
