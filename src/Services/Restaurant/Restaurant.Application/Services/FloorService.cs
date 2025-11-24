using MapsterMapper;
using Restaurant.Application.Dtos;

namespace Restaurant.Application.Services;

public class FloorService : IFloorService
{
    private readonly IRepository<Floor> _floorRepository;
    private readonly IRepository<Room> _roomRepository;
    private readonly IRepository<AppTable> _tableRepository;
    private readonly IRepository<Order> _orderRepository;
    private readonly IMapper _mapper;

    public FloorService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _floorRepository = unitOfWork.GetRepository<Floor>();
        _roomRepository = unitOfWork.GetRepository<Room>();
        _tableRepository = unitOfWork.GetRepository<AppTable>();
        _orderRepository = unitOfWork.GetRepository<Order>();
        _mapper = mapper;
    }

    public async Task<SpResponse> AddAsync(Floor floor)
    {
        return await _floorRepository.ExecuteInTransactionAsync(async () =>
        {
            var floorExist = await FloorExistsCodeEstabAsync(floor.Code, floor.CodEstab);
            if (floorExist) return new SpResponse { Code = "0", Message = "El código ya está en uso" };

            await _floorRepository.AddAsync(floor);
            return new SpResponse { Code = "1", Message = "Registrado correctamente!" };
        });
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        return await _floorRepository.ExecuteInTransactionAsync(async () =>
        {
            var floor = await _floorRepository.GetByIdOrDefaultAsync(id);
            if (floor == null) return new SpResponse { Code = "0", Message = "Floor not found" };

            var orderExists = await CheckOrdersExistAsync(id);
            if (orderExists)
                return new SpResponse { Code = "0", Message = "No se puede eliminar ya existen ordenes registradas!" };

            floor.IsDeleted = true;
            floor.UpdatedByUserId = userId;
            await _floorRepository.UpdateAsync(floor);
            return new SpResponse { Code = "1", Message = "Eliminado correctamente!" };
        });
    }

    public async Task<SpResponse> UpdateAsync(int id, Floor floor)
    {
        return await _floorRepository.ExecuteInTransactionAsync(async () =>
        {
            var floorFound = await _floorRepository.GetByIdOrDefaultAsync(id);
            if (floorFound == null) return new SpResponse { Code = "0", Message = "Floor not found" };

            if (floorFound.Code != floor.Code && await FloorExistsCodeEstabAsync(floor.Code, floorFound.CodEstab))
                return new SpResponse { Code = "0", Message = "El código ya está en uso" };

            // Mapea solo las propiedades necesarias
            floorFound.Capacity = floor.Capacity;
            floorFound.Code = floor.Code;
            floorFound.Description = floor.Description;
            floorFound.IsActive = floor.IsActive;
            floorFound.UpdatedByUserId = floor.UpdatedByUserId;

            await _floorRepository.UpdateAsync(floorFound);
            return new SpResponse { Code = "1", Message = "Actualizado correctamente!" };
        });
    }

    // Mapeo simple sin tablas
    public async Task<SpResponse> GetAllAsync()
    {
        var floors = await _floorRepository.FindAsync(
            predicate: x => !x.IsDeleted,
            includeProperties: x => x.Rooms
        );

        var floorDtos = _mapper.Map<List<FloorItem>>(floors);
        return CreateResponse(floorDtos);
    }

    // Mapeo detallado con tablas
    public async Task<SpResponse> GetByEstabAsync(int establecimientoId)
    {
        var floors = await _floorRepository.FindAsync(
            predicate: x => x.EstablecimientoId == establecimientoId && !x.IsDeleted,
            includeProperties: x => x.Rooms
        );

        var floorDtos = floors.Select(floor => new FloorItem
        {
            Id = floor.Id,
            Name = floor.Description,
            Description = floor.Description,
            IsActive = floor.IsActive,
            CreatedAt = floor.CreatedAt,
            UpdatedAt = floor.UpdatedAt,
            Rooms = floor.Rooms?
                .Where(r => !r.IsDeleted)
                .Select(room => new RoomItem
                {
                    Id = room.Id,
                    Name = room.Description,
                    Description = room.Description,
                    FloorId = room.FloorId,
                    IsActive = room.IsActive,
                    CreatedAt = room.CreatedAt,
                    UpdatedAt = room.UpdatedAt,
                    Tables = room.Tables?
                        .Where(t => !t.IsDeleted)
                        .Select(t => new TableItem
                        {
                            Id = t.Id,
                            Name = t.NumberTable.ToString(),
                            Description = t.Description,
                            Capacity = t.Capacity,
                            IsActive = t.IsActive,
                            RoomId = t.RoomId,
                            CreatedAt = t.CreatedAt,
                            UpdatedAt = t.UpdatedAt
                        })
                        .ToList() ?? []
                })
                .ToList() ?? []
        }).ToList();

        return CreateResponse(floorDtos);
    }

    private async Task<bool> CheckOrdersExistAsync(int floorId)
    {
        var rooms = await _roomRepository.FindAsync(r => r.FloorId == floorId && !r.IsDeleted);
        var roomIds = rooms.Select(r => r.Id).ToList();

        if (!roomIds.Any()) return false;

        var tables = await _tableRepository.FindAsync(t => roomIds.Contains(t.RoomId) && !t.IsDeleted);
        var tableIds = tables.Select(t => t.Id).ToList();

        return tableIds.Any() &&
               await _orderRepository.ExistsAsync(o => tableIds.Contains(o.TableId ?? 0) && !o.IsDeleted);
    }

    private async Task<bool> FloorExistsCodeEstabAsync(string code, string codEstab)
    {
        return await _floorRepository.ExistsAsync(e => e.Code == code && e.CodEstab == codEstab && !e.IsDeleted);
    }

    private SpResponse CreateResponse(List<FloorItem> floorDtos)
    {
        return floorDtos.Count > 0
            ? new SpResponse { Code = "1", Payload = floorDtos }
            : new SpResponse { Code = "0", Message = "Not found!" };
    }
}
