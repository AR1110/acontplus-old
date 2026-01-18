using Acontplus.Persistence.SqlServer.Configurations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sales.Domain.Entities;

namespace Sales.Infrastructure.Persistence.Configurations;

public class SalesConfiguration : BaseEntityTypeConfiguration<Suscripcion>
{
    public override void Configure(EntityTypeBuilder<Suscripcion> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.SuscripcionDetalles)
            .WithOne(x => x.Suscripcion)
            .HasForeignKey(x => x.SuscripcionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
