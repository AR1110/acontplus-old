namespace Common.Application.Mapping;

public static class TagMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        // Create mapping: TagCreate -> Tag
        config.NewConfig<TagCreate, Tag>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.UserManualTags);

        // Update mapping: TagUpdate -> Tag
        config.NewConfig<TagUpdate, Tag>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.DeletedAt)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.UserManualTags);

        // Response mappings
        config.NewConfig<Tag, TagItem>();
    }
}