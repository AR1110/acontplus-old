namespace Identity.Infrastructure.Persistence.Configurations;

public class LoginHistoryConfiguration : BaseEntityTypeConfiguration<LoginHistory>
{
    public override void Configure(EntityTypeBuilder<LoginHistory> builder)
    {
        base.Configure(builder);

        // Configure properties
        builder.Property(lh => lh.UserRoleId)
            .IsRequired();

        builder.Property(lh => lh.UserAgent)
            .HasMaxLength(2000)
            .IsUnicode(false);

        builder.Property(lh => lh.IpAddress)
            .HasMaxLength(15)
            .IsUnicode(false);

        builder.Property(lh => lh.Token)
            .HasMaxLength(4000)
            .IsUnicode(false);

        // Indexes for performance and security monitoring
        builder.HasIndex(lh => lh.UserRoleId)
            .HasDatabaseName("IX_LoginHistory_UserRoleId");

        builder.HasIndex(lh => lh.CreatedAt)
            .HasDatabaseName("IX_LoginHistory_CreatedAt");

        builder.HasIndex(lh => lh.IpAddress)
            .HasDatabaseName("IX_LoginHistory_IpAddress");

        builder.HasIndex(lh => lh.TokenExpiration)
            .HasDatabaseName("IX_LoginHistory_TokenExpiration");

        builder.HasIndex(lh => lh.IsLoggedIn)
            .HasDatabaseName("IX_LoginHistory_IsLoggedIn");

        // Composite indexes for common queries
        builder.HasIndex(lh => new { lh.UserRoleId, lh.CreatedAt })
            .HasDatabaseName("IX_LoginHistory_UserRole_Created");

        builder.HasIndex(lh => new { lh.IsLoggedIn, lh.CreatedAt })
            .HasDatabaseName("IX_LoginHistory_LoggedIn_Created");

        builder.HasIndex(lh => new { lh.IpAddress, lh.CreatedAt })
            .HasDatabaseName("IX_LoginHistory_Ip_Created");
    }
}

public class LoginHistoryArchiveConfiguration : BaseEntityTypeConfiguration<LoginHistoryArchive>
{
    public override void Configure(EntityTypeBuilder<LoginHistoryArchive> builder)
    {
        base.Configure(builder);

        // Configure properties
        builder.Property(lh => lh.UserRoleId)
            .IsRequired();

        builder.Property(lh => lh.UserAgent)
            .HasMaxLength(2000)
            .IsUnicode(false);

        builder.Property(lh => lh.IpAddress)
            .HasMaxLength(15)
            .IsUnicode(false);

        builder.Property(lh => lh.Token)
            .HasMaxLength(4000)
            .IsUnicode(false);

        // Indexes for performance and security monitoring
        builder.HasIndex(lh => lh.UserRoleId)
            .HasDatabaseName("IX_LoginHistoryArchive_UserRoleId");

        builder.HasIndex(lh => lh.CreatedAt)
            .HasDatabaseName("IX_LoginHistoryArchive_CreatedAt");
    }
}
