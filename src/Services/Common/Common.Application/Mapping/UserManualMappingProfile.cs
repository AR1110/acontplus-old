namespace Common.Application.Mapping;

public static class UserManualMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping: UserManualCreate -> UserManual
        config.NewConfig<UserManualCreate, UserManual>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.UserManualType);

        // Update mapping: UserManualUpdate -> UserManual
        config.NewConfig<UserManualUpdate, UserManual>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.UserManualType);
        // Create mapping: UserManualTypeCreate -> UserManualType
        config.NewConfig<UserManualTypeCreate, UserManualType>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.UserManuals);

        // Update mapping: UserManualTypeUpdate -> UserManualType
        config.NewConfig<UserManualTypeUpdate, UserManualType>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.UserManuals);

        // Map domain UserManual -> UserManualItem
        config.NewConfig<UserManual, UserManualItem>()
            .Map(dest => dest.UserManualTypeName, src => src.UserManualType != null ? src.UserManualType.Name : string.Empty);

        // Map domain UserManual -> UserManualCreatedResponse
        config.NewConfig<UserManual, UserManualCreatedResponse>()
            .Map(dest => dest.UserManualTypeName, src => src.UserManualType != null ? src.UserManualType.Name : string.Empty);

        // Map domain UserManual -> UserManualUpdatedResponse
        config.NewConfig<UserManual, UserManualUpdatedResponse>()
            .Map(dest => dest.UserManualTypeName, src => src.UserManualType != null ? src.UserManualType.Name : string.Empty)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt ?? DateTime.UtcNow)
            .Map(dest => dest.UpdatedByUserId, src => src.UpdatedByUserId ?? src.CreatedByUserId);
    }
}
