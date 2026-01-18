using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Api.Persistence.Configurations;

public class UserProfileConfiguration : BaseEntityTypeConfiguration<UserProfile>
{
    public override void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        base.Configure(builder);

        #region Core Profile Properties
        builder.Property(up => up.PreferredLanguage)
            .HasMaxLength(50)
            .IsUnicode(false)
            .HasDefaultValue("es-ES");

        builder.Property(up => up.TimeZone)
            .HasMaxLength(50)
            .IsUnicode(false)
            .HasDefaultValue("America/Guayaquil");

        builder.Property(up => up.Theme)
            .HasMaxLength(50)
            .IsUnicode(false)
            .HasDefaultValue("light");

        builder.Property(up => up.EmailNotifications)
            .HasDefaultValue(true);

        builder.Property(up => up.SmsNotifications)
            .HasDefaultValue(false);

        builder.Property(up => up.WhatsAppNotifications)
            .HasDefaultValue(false);
        #endregion

        #region Personal Information
        builder.Property(up => up.FirstName)
            .HasMaxLength(100)
            .IsUnicode(false);

        builder.Property(up => up.LastName)
            .HasMaxLength(100)
            .IsUnicode(false);

        builder.Property(up => up.Gender)
            .HasConversion<string>()
            .HasMaxLength(10)
            .IsUnicode(false);

        // Simplified customer identification
        builder.Property(up => up.CustomerId)
            .IsRequired(false);
        #endregion

        #region Application Preferences
        builder.Property(up => up.DefaultCurrency)
            .HasMaxLength(20)
            .IsUnicode(false)
            .HasDefaultValue("USD");

        builder.Property(up => up.DateFormat)
            .HasMaxLength(20)
            .IsUnicode(false)
            .HasDefaultValue("dd/MM/yyyy");

        builder.Property(up => up.TimeFormat)
            .HasMaxLength(20)
            .IsUnicode(false)
            .HasDefaultValue("HH:mm");

        builder.Property(up => up.NumberFormat)
            .HasMaxLength(20)
            .IsUnicode(false)
            .HasDefaultValue("en-US");

        builder.Property(up => up.DefaultPageSize)
            .HasDefaultValue(25);

        builder.Property(up => up.ShowAdvancedFeatures)
            .HasDefaultValue(false);
        #endregion

        #region Security & Access
        builder.Property(up => up.RequirePasswordChange)
            .HasDefaultValue(false);

        builder.Property(up => up.SessionTimeoutMinutes)
            .HasDefaultValue(60);
        #endregion

        #region Communication Preferences
        builder.Property(up => up.ReceivePromotionalEmails)
            .HasDefaultValue(true);

        builder.Property(up => up.ReceiveSystemUpdates)
            .HasDefaultValue(true);

        builder.Property(up => up.ReceiveNewsletters)
            .HasDefaultValue(false);

        builder.Property(up => up.PreferredContactMethod)
            .HasMaxLength(100)
            .IsUnicode(false)
            .HasDefaultValue("Email");

        builder.Property(up => up.PreferredContactTime)
            .HasMaxLength(50)
            .IsUnicode(false);
        #endregion

        #region Flexible Properties
        builder.Property(up => up.CustomProperties)
            .HasColumnType("nvarchar(max)");
        #endregion
    }
}
