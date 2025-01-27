using Common.Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Restaurant.API.Entities;

namespace Restaurant.API.Data.Configurations;

public class FloorConfiguration : BaseEntityTypeConfiguration<Floor>
{
    public override void Configure(EntityTypeBuilder<Floor> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.Rooms)
            .WithOne(x => x.Floor)
            .HasForeignKey(x => x.FloorId);
    }
}

public class RoomConfiguration : BaseEntityTypeConfiguration<Room>
{
    public override void Configure(EntityTypeBuilder<Room> builder)
    {
        base.Configure(builder);

        builder
            .HasMany(x => x.Tables)
            .WithOne(x => x.Room)
            .HasForeignKey(x => x.RoomId);
    }
}
