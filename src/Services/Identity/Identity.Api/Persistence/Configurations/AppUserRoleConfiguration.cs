using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Api.Persistence.Configurations;

public class AppUserRoleConfiguration : IEntityTypeConfiguration<AppUserRole>
{
    public void Configure(EntityTypeBuilder<AppUserRole> builder)
    {
        builder.ToTable("UserRoles", "Auth");

        // Configure composite key
        builder.HasKey(ur => new { ur.UserId, ur.RoleId });

        // Indexes for performance
        builder.HasIndex(ur => ur.UserId)
            .HasDatabaseName("IX_AspNetUserRoles_UserId");

        builder.HasIndex(ur => ur.RoleId)
            .HasDatabaseName("IX_AspNetUserRoles_RoleId");

        // Note: Relationships are configured in the principal entities (AppUser and AppRole)
        // to avoid circular references and duplicate configurations
    }
}
