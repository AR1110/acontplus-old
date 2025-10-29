using Mapster;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using Restaurant.Domain.DTOs;
using System.Reflection;

namespace Restaurant.Application.Extensions
{
    public static class RestaurantMappings
    {
        public static void RegisterMappings(this IServiceCollection services)
        {
            var config = new TypeAdapterConfig();

            // Scan this assembly for Mapster configurations
            config.Scan(typeof(RestaurantMappings).Assembly);

            // Floor -> FloorResponseDto (mapeo básico sin tablas en rooms)
            config.NewConfig<Floor, FloorResponseDto>()
                .Map(dest => dest.Rooms, src => src.Rooms != null
                    ? src.Rooms.Where(r => !r.IsDeleted).Select(r => new RoomResponseDto
                    {
                        Id = r.Id,
                        FloorId = r.FloorId,
                        Code = r.Code,
                        Description = r.Description,
                        Capacity = r.Capacity,
                        IsActive = r.IsActive,
                        Tables = null // Explícitamente sin tablas
                    }).ToList()
                    : new List<RoomResponseDto>());

            // Room -> RoomResponseDto (mapeo básico sin tablas)
            config.NewConfig<Room, RoomResponseDto>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.FloorId, src => src.FloorId)
                .Map(dest => dest.Code, src => src.Code)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Capacity, src => src.Capacity)
                .Map(dest => dest.IsActive, src => src.IsActive)
                .Ignore(dest => dest.Tables);

            // AppTable -> TableResponseDto
            config.NewConfig<AppTable, TableResponseDto>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.RoomId, src => src.RoomId)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsActive, src => src.IsActive);

            services.AddSingleton(config);
            services.AddScoped<IMapper, ServiceMapper>();
        }
    }
}
