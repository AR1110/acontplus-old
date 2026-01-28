namespace Configuration.Application.Mapping;

public static class ReportMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ReportCreate, Report>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId);
        config.NewConfig<ReportUpdate, Report>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId);
        config.NewConfig<Report, ReportItem>();
    }
}
