using Mapster;
using Restaurant.Domain.Dtos;

namespace Restaurant.Infrastructure.Persistence.Mappings;

public class FloorMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Floor, FloorItem>()
            .Map(dest => dest.CodEstab, src => src.CodEstab)
            .Map(dest => dest.EstablecimientoId, src => src.EstablecimientoId)
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.Capacity, src => src.Capacity)
            .Map(dest => dest.IsActive, src => src.IsActive);

        config.NewConfig<Room, RoomItem>()
            .Map(dest => dest.FloorId, src => src.FloorId)
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.Capacity, src => src.Capacity)
            .Map(dest => dest.IsActive, src => src.IsActive);

        config.NewConfig<AppTable, TableItem>()
            .Map(dest => dest.RoomId, src => src.RoomId)
            .Map(dest => dest.NumberTable, src => src.NumberTable)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.Capacity, src => src.Capacity)
            .Map(dest => dest.Assigned, src => src.Assigned)
            .Map(dest => dest.IsActive, src => src.IsActive);
    }
}
