namespace Configuration.Application.Mapping;

public static class CompanyMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping: CompanyCreate -> Company
        config.NewConfig<CompanyCreate, Company>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.Uuid)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.WhatsAppUsages);

        // Update mapping: CompanyUpdate -> Company
        config.NewConfig<CompanyUpdate, Company>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.Uuid)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.WhatsAppUsages);

        // Response mappings
        config.NewConfig<Company, CompanyItem>();
        config.NewConfig<Company, CompanyCreatedResponse>();
    }
}
