namespace Configuration.Application.Mapping;

public static class ScheduleMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping: ScheduleCreate -> Schedule
        config.NewConfig<ScheduleCreate, Schedule>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.Day);

        // Update mapping: ScheduleUpdate -> Schedule
        config.NewConfig<ScheduleUpdate, Schedule>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.Day);

        // Response mappings
        config.NewConfig<Schedule, ScheduleItem>()
            .Map(dest => dest.DayName, src => src.Day != null ? src.Day.Name : string.Empty);
    }
}
