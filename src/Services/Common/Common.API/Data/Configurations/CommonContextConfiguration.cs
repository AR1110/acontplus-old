using Common.API.Entities;
using Common.Notifications.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.API.Data.Configurations;

public class EmailSenderConfiguration : BaseEntityTypeConfiguration<EmailSenderConfig>
{
    public override void Configure(EntityTypeBuilder<EmailSenderConfig> builder)
    {
        base.Configure(builder);

        builder
            .Property(x => x.IsGlobal)
            .HasDefaultValue(false);
    }
}

public class HousingTypeConfiguration : BaseEntityTypeConfiguration<HousingType>
{
    public override void Configure(EntityTypeBuilder<HousingType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_HousingType_Code")
            .IsUnique();
    }
}
public class MaritalStatusConfiguration : BaseEntityTypeConfiguration<MaritalStatus>
{
    public override void Configure(EntityTypeBuilder<MaritalStatus> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_MaritalStatus_Code")
            .IsUnique();
    }
}

public class NotificationConfiguration : BaseEntityTypeConfiguration<Notification>
{
    public override void Configure(EntityTypeBuilder<Notification> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.Attachments)
            .WithOne(x => x.Notification)
            .HasForeignKey(x => x.NotificationId);

        builder
            .Property(x => x.IsRead)
            .HasDefaultValue(false);
    }
}

public class NotificationTypeConfiguration : BaseEntityTypeConfiguration<NotificationType>
{
    public override void Configure(EntityTypeBuilder<NotificationType> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_NotificationType_Code")
            .IsUnique();
    }
}

public class PriorityConfiguration : BaseEntityTypeConfiguration<Priority>
{
    public override void Configure(EntityTypeBuilder<Priority> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Priority_Code")
            .IsUnique();
    }
}

public class StatusConfiguration : BaseEntityTypeConfiguration<Status>
{
    public override void Configure(EntityTypeBuilder<Status> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Status_Code")
            .IsUnique();
    }
}

public class WhatsAppSenderConfiguration : BaseEntityTypeConfiguration<WhatsAppSenderConfig>
{
    public override void Configure(EntityTypeBuilder<WhatsAppSenderConfig> builder)
    {
        base.Configure(builder);

        builder
            .Property(x => x.IsGlobal)
            .HasDefaultValue(false);
    }
}
