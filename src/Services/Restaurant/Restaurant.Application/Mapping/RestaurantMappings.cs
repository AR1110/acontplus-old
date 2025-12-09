using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using Restaurant.Application.Dtos;

namespace Restaurant.Application.Mapping
{
    public static class RestaurantMappings
    {
        public static void RegisterMappings(this IServiceCollection services)
        {
            var config = new TypeAdapterConfig();

            // Scan this assembly for Mapster configurations
            config.Scan(typeof(RestaurantMappings).Assembly);

            // Floor -> FloorItem (mapeo básico sin tablas en rooms)
            config.NewConfig<Floor, FloorItem>()
                .Map(dest => dest.Name, src => src.Description)
                .Map(dest => dest.Rooms, src => src.Rooms != null
                    ? src.Rooms.Where(r => !r.IsDeleted).Select(r => new RoomItem
                    {
                        Id = r.Id,
                        FloorId = r.FloorId,
                        Name = r.Description,
                        Description = r.Description,
                        IsActive = r.IsActive,
                        CreatedAt = r.CreatedAt,
                        UpdatedAt = r.UpdatedAt,
                        Tables = new List<TableItem>() // Explícitamente sin tablas
                    }).ToList()
                    : new List<RoomItem>());

            // Room -> RoomItem (mapeo básico sin tablas)
            config.NewConfig<Room, RoomItem>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.FloorId, src => src.FloorId)
                .Map(dest => dest.Name, src => src.Description)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsActive, src => src.IsActive)
                .Map(dest => dest.CreatedAt, src => src.CreatedAt)
                .Map(dest => dest.UpdatedAt, src => src.UpdatedAt)
                .Ignore(dest => dest.Tables);

            // AppTable -> TableItem
            config.NewConfig<AppTable, TableItem>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.RoomId, src => src.RoomId)
                .Map(dest => dest.Name, src => src.NumberTable.ToString())
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Capacity, src => src.Capacity)
                .Map(dest => dest.IsActive, src => src.IsActive)
                .Map(dest => dest.CreatedAt, src => src.CreatedAt)
                .Map(dest => dest.UpdatedAt, src => src.UpdatedAt);

            services.AddSingleton(config);
            services.AddScoped<IMapper, ServiceMapper>();
        }
    }
}
