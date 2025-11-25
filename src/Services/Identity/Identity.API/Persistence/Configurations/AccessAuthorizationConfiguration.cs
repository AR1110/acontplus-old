using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Api.Persistence.Configurations;

public class AccessAuthorizationConfiguration : BaseEntityTypeConfiguration<AccessAuthorization>
{
    public override void Configure(EntityTypeBuilder<AccessAuthorization> builder)
    {
        base.Configure(builder);

        builder.ToTable("AccessAuthorization", "Seguridad");

        // Configure properties
        builder.Property(aa => aa.Uuid)
            .IsRequired();

        builder.Property(aa => aa.Code)
            .IsRequired();

        builder.Property(aa => aa.SenderId)
            .IsRequired();

        builder.Property(aa => aa.ReceiverId)
            .IsRequired();

        // Indexes for performance and security
        builder.HasIndex(aa => aa.Uuid)
            .HasDatabaseName("IX_AccessAuthorization_Uuid");

        builder.HasIndex(aa => new { aa.Uuid, aa.Code })
            .HasDatabaseName("IX_AccessAuthorization_Uuid_Code");

        builder.HasIndex(aa => aa.SenderId)
            .HasDatabaseName("IX_AccessAuthorization_SenderId");

        builder.HasIndex(aa => aa.ReceiverId)
            .HasDatabaseName("IX_AccessAuthorization_ReceiverId");

        builder.HasIndex(aa => aa.CreatedAt)
            .HasDatabaseName("IX_AccessAuthorization_CreatedAt");

        // Composite index for common queries
        builder.HasIndex(aa => new { aa.SenderId, aa.IsActive, aa.CreatedAt })
            .HasDatabaseName("IX_AccessAuthorization_Sender_Active_Created");
    }
}
