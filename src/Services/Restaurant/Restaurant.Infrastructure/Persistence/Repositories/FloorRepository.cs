using Mapster;
using Restaurant.Domain.Dtos;

namespace Restaurant.Infrastructure.Persistence.Repositories;

public class FloorRepository : IFloorRepository
{
    private readonly RestaurantContext _context;

    public FloorRepository(RestaurantContext context)
    {
        _context = context;
    }

    public async Task<SpResponse> AddAsync(Floor floor)
    {
        var floorExist = await FloorExistsCodeEstabAsync(floor.Code, floor.CodEstab);
        if (floorExist) return new SpResponse { Code = "0", Message = "El código ya está en uso" };

        _context.Floors.Add(floor);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrado correctamente!" };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var floor = await _context.Floors.FindAsync(id);
        if (floor == null) return new SpResponse { Code = "0", Message = "Floor not found" };

        var orderExists = await CheckOrdersExistAsync(id);
        if (orderExists)
            return new SpResponse { Code = "0", Message = "No se puede eliminar ya existen ordenes registradas!" };

        floor.IsDeleted = true;
        floor.UpdatedByUserId = userId;
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminado correctamente!" };
    }

    public async Task<SpResponse> UpdateAsync(int id, Floor floor)
    {
        var floorFound = await _context.Floors.FindAsync(id);
        if (floorFound == null) return new SpResponse { Code = "0", Message = "Floor not found" };

        if (floorFound.Code != floor.Code && await FloorExistsCodeEstabAsync(floor.Code, floorFound.CodEstab))
            return new SpResponse { Code = "0", Message = "El código ya está en uso" };

        floorFound.Capacity = floor.Capacity;
        floorFound.Code = floor.Code;
        floorFound.Description = floor.Description;
        floorFound.IsActive = floor.IsActive;
        floorFound.UpdatedByUserId = floor.UpdatedByUserId;

        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado correctamente!" };
    }

    // Mapeo simple sin tablas
    public async Task<SpResponse> GetAllAsync()
    {
        var floors = await _context.Floors
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .Include(x => x.Rooms.Where(r => !r.IsDeleted))
            .ToListAsync();

        var floorDtos = floors.Adapt<List<FloorItem>>();
        return CreateResponse(floorDtos);
    }

    // Mapeo detallado con tablas
    public async Task<SpResponse> GetByEstabAsync(int establecimientoId)
    {
        var floors = await _context.Floors
            .AsNoTracking()
            .Where(x => x.EstablecimientoId == establecimientoId && !x.IsDeleted)
            .Include(x => x.Rooms.Where(r => !r.IsDeleted))
            .ThenInclude(r => r.Tables.Where(t => !t.IsDeleted))
            .ToListAsync();

        var floorDtos = floors.Adapt<List<FloorItem>>();
        return CreateResponse(floorDtos);
    }

    private async Task<bool> CheckOrdersExistAsync(int floorId)
    {
        return await _context.Orders
            .Join(_context.Tables.Where(t => !t.IsDeleted),
                order => order.TableId,
                table => table.Id,
                (order, table) => new { order, table })
            .Join(_context.Rooms.Where(r => !r.IsDeleted),
                combined => combined.table.RoomId,
                room => room.Id,
                (combined, room) => new { combined.order, room })
            .AnyAsync(combined => combined.room.FloorId == floorId && !combined.order.IsDeleted);
    }

    private async Task<bool> FloorExistsCodeEstabAsync(string code, string codEstab)
    {
        return await _context.Floors
            .AnyAsync(e => e.Code == code && e.CodEstab == codEstab && !e.IsDeleted);
    }

    private SpResponse CreateResponse(List<FloorItem> floorDtos)
    {
        return floorDtos.Count > 0
            ? new SpResponse { Code = "1", Payload = floorDtos }
            : new SpResponse { Code = "0", Message = "Not found!" };
    }
}
