using Common.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.Infrastructure.Persistence.Configurations;

public class ReleaseConfiguration : BaseEntityTypeConfiguration<Release>
{
    public override void Configure(EntityTypeBuilder<Release> builder)
    {
        base.Configure(builder);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class ScheduleConfiguration : BaseEntityTypeConfiguration<Schedule>
{
    public override void Configure(EntityTypeBuilder<Schedule> builder)
    {
        base.Configure(builder);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class UserManualTypeConfiguration : BaseEntityTypeConfiguration<UserManualType>
{
    public override void Configure(EntityTypeBuilder<UserManualType> builder)
    {
        base.Configure(builder);

        builder.HasMany(um => um.UserManuals)
            .WithOne(um => um.UserManualType)
            .HasForeignKey(um => um.UserManualTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.Code)
            .HasDatabaseName("UX_UserManual_Code")
            .IsUnique();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class TagConfiguration : BaseEntityTypeConfiguration<Tag>
{
    public override void Configure(EntityTypeBuilder<Tag> builder)
    {
        base.Configure(builder);

        builder.HasMany(t => t.UserManualTags)
            .WithOne(ut => ut.Tag)
            .HasForeignKey(ut => ut.TagId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class UserManualTagConfiguration : BaseEntityTypeConfiguration<UserManualTag>
{
    public override void Configure(EntityTypeBuilder<UserManualTag> builder)
    {
        base.Configure(builder);

        builder.HasKey(umt => new { umt.UserManualId, umt.TagId });

        builder.HasOne(umt => umt.UserManual)
            .WithMany(um => um.UserManualTags)
            .HasForeignKey(umt => umt.UserManualId);

        builder.HasOne(umt => umt.Tag)
            .WithMany(t => t.UserManualTags)
            .HasForeignKey(umt => umt.TagId);

        builder.Ignore(umt => umt.Id);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class UserManualConfiguration : BaseEntityTypeConfiguration<UserManual>
{
    public override void Configure(EntityTypeBuilder<UserManual> builder)
    {
        base.Configure(builder);
        // Note: Menu navigation removed - cross-service boundary. Only MenuId FK is kept.

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}
