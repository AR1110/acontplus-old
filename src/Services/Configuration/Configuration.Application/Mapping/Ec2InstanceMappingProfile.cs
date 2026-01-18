namespace Configuration.Application.Mapping;

public static class Ec2InstanceMappingProfile
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Ec2InstanceCreate, Ec2Instance>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.IsMobileRequest);

        config.NewConfig<Ec2InstanceUpdate, Ec2Instance>()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.CreatedByUserId)
            .Ignore(dest => dest.UpdatedByUserId)
            .Ignore(dest => dest.DeletedByUserId)
            .Ignore(dest => dest.IsActive)
            .Ignore(dest => dest.IsDeleted)
            .Ignore(dest => dest.IsMobileRequest);

        config.NewConfig<Ec2Instance, Ec2InstanceItem>();
    }
}
