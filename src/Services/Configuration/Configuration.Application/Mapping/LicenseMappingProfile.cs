namespace Configuration.Application.Mapping;

public static class LicenseMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Licenses, LicenseItem>()
            .Map(dest => dest.Details, src => src.LicenseDetails);

        config.NewConfig<LicenseDetails, LicenseDetailItem>()
            .Map(dest => dest.ApplicationId, src => src.AplicacionId);
    }
}
