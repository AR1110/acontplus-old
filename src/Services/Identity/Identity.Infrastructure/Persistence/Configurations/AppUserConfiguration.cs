// NOTE: This configuration is commented out - Identity entities are managed manually outside of EF Core migrations
/*
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Api.Persistence.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.ToTable("Users", "Auth");

        // Configure properties
        builder.Property(u => u.DisplayName)
            .HasMaxLength(100)
            .IsUnicode(false);

        builder.Property(u => u.UserName)
            .HasMaxLength(256)
            .IsRequired()
            .IsUnicode(false);

        builder.Property(u => u.NormalizedUserName)
            .HasMaxLength(256)
            .IsUnicode(false);

        builder.Property(u => u.Email)
            .HasMaxLength(256)
            .IsUnicode(false);

        builder.Property(u => u.NormalizedEmail)
            .HasMaxLength(256)
            .IsUnicode(false);

        // Indexes for performance
        builder.HasIndex(u => u.UserName)
            .HasDatabaseName("IX_AppUser_UserName")
            .IsUnique();

        builder.HasIndex(u => u.NormalizedUserName)
            .HasDatabaseName("UserNameIndex")
            .IsUnique();

        builder.HasIndex(u => u.Email)
            .HasDatabaseName("IX_AppUser_Email");

        builder.HasIndex(u => u.NormalizedEmail)
            .HasDatabaseName("EmailIndex");

        // Configure relationships - only define from the principal side
        builder.HasMany(u => u.UserRoles)
            .WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.RefreshTokens)
            .WithOne(rt => rt.AppUser)
            .HasForeignKey(rt => rt.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(u => u.UserProfile)
            .WithOne(up => up.AppUser)
            .HasForeignKey<UserProfile>(up => up.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
*/
