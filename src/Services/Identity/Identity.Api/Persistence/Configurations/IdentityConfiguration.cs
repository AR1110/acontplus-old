using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StackExchange.Redis;

namespace Identity.Api.Persistence.Configurations;

public class ActionsConfiguration : BaseEntityTypeConfiguration<Actions>
{
    public override void Configure(EntityTypeBuilder<Actions> builder)
    {
        base.Configure(builder);

        builder
            .HasIndex(x => x.Code)
            .HasDatabaseName("UX_Actions_Code")
            .IsUnique();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class LicenciaAccesoConfiguration : BaseEntityTypeConfiguration<LicenciaAcceso>
{
    public override void Configure(EntityTypeBuilder<LicenciaAcceso> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.LicenciaAccesoDetalles)
            .WithOne(m => m.LicenciaAcceso)
            .HasForeignKey(m => m.LicenciaAccesoId)
            .IsRequired();

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
        builder.Ignore(x => x.DeletedBy);
    }
}

public class LicenciaAccesoDetalleConfiguration : BaseEntityTypeConfiguration<LicenciaAccesoDetalle>
{
    public override void Configure(EntityTypeBuilder<LicenciaAccesoDetalle> builder)
    {
        base.Configure(builder);

        builder.Ignore(x => x.CreatedBy);
        builder.Ignore(x => x.UpdatedBy);
    }
}
