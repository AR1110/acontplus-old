using Mapster;
using Restaurant.Domain.DTOs;

namespace Restaurant.Infrastructure.Persistence.Mappings;

public class FloorMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Floor, FloorResponseDto>()
            .Map(dest => dest.Rooms, src => src.Rooms != null
                ? src.Rooms.Where(r => !r.IsDeleted)
                    .Select(r => r.Adapt<RoomResponseDto>())
                    .ToList()
                : new List<RoomResponseDto>());

        config.NewConfig<Room, RoomResponseDto>()
            .Map(dest => dest.Tables, src => src.Tables != null
                ? src.Tables.Where(t => !t.IsDeleted)
                    .Select(t => t.Adapt<TableResponseDto>())
                    .ToList()
                : new List<TableResponseDto>());

        config.NewConfig<AppTable, TableResponseDto>();
    }
}
