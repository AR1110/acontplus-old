namespace Restaurant.Infrastructure.Persistence.Repositories;

public class RoomRepository(RestaurantContext context) : IRoomRepository
{
    public async Task<SpResponse> AddAsync(Room room)
    {
        var roomExists = RoomExists(room.FloorId, room.Code);
        if (roomExists) return new SpResponse { Code = "0", Message = "El código ya está en uso" };
        context.Rooms.Add(room);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrado correctamente!", Payload = room };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var room = await context.Rooms.FindAsync(id);
        if (room == null) return new SpResponse { Code = "0", Message = "Room not found" };
        var orderExists = await context.Orders
            .Join(context.Tables,
                order => order.TableId,
                table => table.Id,
                (order, table) => new { order, table })
            .Join(context.Rooms,
                combined => combined.table.RoomId,
                room => room.Id,
                (combined, room) => new { combined.order, room })
            .AnyAsync(f => f.room.Id == id);

        if (orderExists)
            return new SpResponse { Code = "0", Message = "No se puede eliminar ya existen ordenes registradas!" };

        context.Remove(room);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminadoa correctamente!" };
    }

    public async Task<SpResponse> GetAllAsync()
    {
        var floors = await context.Rooms.AsNoTracking().Include(x => x.Floor).Where(x => !x.IsDeleted).ToListAsync();
        return floors.Count > 0
            ? new SpResponse { Code = "1", Payload = floors }
            : new SpResponse { Code = "0", Message = "Not found!" };
    }

    public async Task<SpResponse> GetByEstabAsync(int establecimientoId)
    {
        var rooms = await context.Rooms
            .AsNoTracking()
            .Include(x => x.Floor)
            .Include(x => x.Tables)
            .Where(x => x.Floor.EstablecimientoId == establecimientoId && !x.IsDeleted)
            .ToListAsync();
        return rooms.Count > 0
            ? new SpResponse { Code = "1", Payload = rooms }
            : new SpResponse { Code = "0", Message = "Not found!" };
    }

    public async Task<SpResponse> UpdateAsync(int id, Room room)
    {
        var roomFound = await context.Rooms.FindAsync(id);
        if (roomFound == null) return new SpResponse { Code = "0", Message = "Room not found" };

        roomFound.Code = room.Code;
        roomFound.Capacity = room.Capacity;
        roomFound.Description = room.Description;
        roomFound.IsActive = room.IsActive;
        roomFound.UpdatedByUserId = room.UpdatedByUserId;
        context.Update(roomFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado correctamente!" };
    }

    private bool RoomExists(int id)
    {
        return context.Rooms.Any(e => e.Id == id);
    }

    private bool RoomExists(int floorId, string code)
    {
        return context.Rooms.Any(e => e.FloorId == floorId && e.Code == code);
    }
}
