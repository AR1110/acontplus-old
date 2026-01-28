namespace Identity.Infrastructure.Persistence.Configurations;

public class ForgotPasswordConfiguration : BaseEntityTypeConfiguration<ForgotPassword>
{
    public override void Configure(EntityTypeBuilder<ForgotPassword> builder)
    {
        base.Configure(builder);

        // Configure properties
        builder.Property(fp => fp.Email)
            .IsRequired()
            .HasMaxLength(100)
            .IsUnicode(false);

        builder.Property(fp => fp.Token)
            .IsRequired()
            .HasDefaultValueSql("NEWID()");

        builder.Property(fp => fp.Expiration)
            .IsRequired()
            .HasDefaultValueSql("DATEADD(HOUR, 1, GETUTCDATE())"); // Default 1 hour expiration

        // Indexes for performance and security
        builder.HasIndex(fp => fp.Email)
            .HasDatabaseName("IX_ForgotPassword_Email");

        builder.HasIndex(fp => fp.Token)
            .HasDatabaseName("IX_ForgotPassword_Token")
            .IsUnique();

        builder.HasIndex(fp => fp.Expiration)
            .HasDatabaseName("IX_ForgotPassword_Expiration");

        // Composite indexes for common queries
        builder.HasIndex(fp => new { fp.Email, fp.Token, fp.Expiration })
            .HasDatabaseName("IX_ForgotPassword_Email_Token_Expiration");

        builder.HasIndex(fp => new { fp.IsActive, fp.Expiration })
            .HasDatabaseName("IX_ForgotPassword_Active_Expiration");
    }
}
