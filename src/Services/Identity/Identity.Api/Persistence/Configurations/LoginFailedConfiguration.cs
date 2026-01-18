using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Api.Persistence.Configurations;

public class LoginFailedConfiguration : BaseEntityTypeConfiguration<LoginFailed>
{
    public override void Configure(EntityTypeBuilder<LoginFailed> builder)
    {
        base.Configure(builder);

        // Configure properties
        builder.Property(lf => lf.Username)
            .HasMaxLength(50)
            .IsUnicode(false);

        builder.Property(lf => lf.Password)
            .HasMaxLength(255)
            .IsUnicode(false);

        builder.Property(lf => lf.UserAgent)
            .HasMaxLength(2000)
            .IsUnicode(false);

        builder.Property(lf => lf.IpAddress)
            .HasMaxLength(15)
            .IsUnicode(false);

        // Indexes for security monitoring
        builder.HasIndex(lf => lf.Username)
            .HasDatabaseName("IX_LoginFailed_Username");

        builder.HasIndex(lf => lf.IpAddress)
            .HasDatabaseName("IX_LoginFailed_IpAddress");

        builder.HasIndex(lf => lf.CreatedAt)
            .HasDatabaseName("IX_LoginFailed_CreatedAt");

        // Composite indexes for security analysis
        builder.HasIndex(lf => new { lf.Username, lf.CreatedAt })
            .HasDatabaseName("IX_LoginFailed_Username_Created");

        builder.HasIndex(lf => new { lf.IpAddress, lf.CreatedAt })
            .HasDatabaseName("IX_LoginFailed_Ip_Created");
    }
}
