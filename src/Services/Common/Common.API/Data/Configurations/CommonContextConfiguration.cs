using Common.API.Entities;
using Common.Notifications.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Common.API.Data.Configurations;

public class AttachmentConfiguration : BaseEntityTypeConfiguration<Attachment>
{
    public override void Configure(EntityTypeBuilder<Attachment> builder)
    {
        base.Configure(builder);

        builder.ToTable("Attachment", "Common");
    }
}
public class EmailSenderConfiguration : BaseEntityTypeConfiguration<EmailSenderConfig>
{
    public override void Configure(EntityTypeBuilder<EmailSenderConfig> builder)
    {
        base.Configure(builder);

        builder
            .Property(x => x.IsGlobal)
            .HasDefaultValue(false);

        builder.ToTable("EmailSenderConfig", "Config");
    }
}
public class EmailQueueConfiguration : BaseEntityTypeConfiguration<EmailQueue>
{
    public override void Configure(EntityTypeBuilder<EmailQueue> builder)
    {
        base.Configure(builder);

        builder.ToTable("EmailQueue", "Common");
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

        builder.ToTable("Notification", "Common");
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

        builder
            .Property(x => x.Name)
            .HasMaxLength(100);

        builder.ToTable("NotificationType", "Common");
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

        builder.ToTable("Priority", "Common");
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

        builder.ToTable("Status", "Common");
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

        builder.ToTable("WhatsAppSenderConfig", "Config");
    }
}
public class WhatsAppMessageConfiguration : BaseEntityTypeConfiguration<WhatsAppMessage>
{
    public override void Configure(EntityTypeBuilder<WhatsAppMessage> builder)
    {
        base.Configure(builder);

        builder.ToTable("WhatsAppMessage", "Common");
    }
}
