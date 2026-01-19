// NOTE: This configuration is commented out - Identity entities are managed manually outside of EF Core migrations
/*
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Api.Persistence.Configurations;

public class AppRoleConfiguration : IEntityTypeConfiguration<AppRole>
{
    public void Configure(EntityTypeBuilder<AppRole> builder)
    {
        builder.ToTable("Roles", "Auth");

        // Configure properties
        builder.Property(r => r.Name)
            .HasMaxLength(256)
            .IsUnicode(false);

        builder.Property(r => r.NormalizedName)
            .HasMaxLength(256)
            .IsUnicode(false);

        // Indexes for performance
        builder.HasIndex(r => r.NormalizedName)
            .HasDatabaseName("RoleNameIndex")
            .IsUnique();

        // Configure relationships - only define from the principal side
        builder.HasMany(r => r.UserRoles)
            .WithOne(ur => ur.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}
*/
