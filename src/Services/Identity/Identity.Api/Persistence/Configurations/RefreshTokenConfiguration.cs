using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Api.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("RefreshTokens", "Auth");

        // Configure key
        builder.HasKey(rt => rt.Id);

        // Configure properties
        builder.Property(rt => rt.Token)
            .HasMaxLength(4000)
            .IsRequired()
            .IsUnicode(false);

        builder.Property(rt => rt.Created)
            .IsRequired();

        builder.Property(rt => rt.Expires)
            .IsRequired();

        builder.Property(rt => rt.CreatedByIp)
            .HasMaxLength(39)
            .IsUnicode(false);

        builder.Property(rt => rt.RevokedByIp)
            .HasMaxLength(39)
            .IsUnicode(false);

        builder.Property(rt => rt.ReplacedByToken)
            .HasMaxLength(4000)
            .IsUnicode(false);

        builder.Property(rt => rt.DeviceInfo)
            .HasMaxLength(500)
            .IsUnicode(false);

        builder.Property(rt => rt.UserAgent)
            .HasMaxLength(2000)
            .IsUnicode(false);

        // Indexes for performance and security
        builder.HasIndex(rt => rt.Token)
            .HasDatabaseName("IX_RefreshTokens_Token")
            .IsUnique();

        builder.HasIndex(rt => rt.AppUserId)
            .HasDatabaseName("IX_RefreshTokens_AppUserId");

        builder.HasIndex(rt => rt.Expires)
            .HasDatabaseName("IX_RefreshTokens_Expires");

        builder.HasIndex(rt => new { rt.AppUserId, rt.Expires })
            .HasDatabaseName("IX_RefreshTokens_UserId_Expires");

        // Note: Relationship is configured in the AppUser configuration to avoid duplication
    }
}
