using Restaurant.Api.Entities;
using Restaurant.Api.Interfaces;

namespace Restaurant.Api.Services;

public class FloorService(RestaurantContext context) : IFloorService
{
    public async Task<ApiResponse> AddAsync(Floor floor)
    {
        var floorExist = FloorExistsCodeEstab(floor.Code, floor.CodEstab);
        if (floorExist) return new ApiResponse { Code = "0", Message = "El código ya está en uso" };
        if (floor.Rooms.Count > 0)
            foreach (var item in floor.Rooms)
                item.Id = 0;

        context.Floors.Add(floor);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrado correctamente!" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var floor = await context.Floors.FindAsync(id);
        if (floor == null) return new ApiResponse { Code = "0", Message = "Floor not found" };

        var orderExists = await context.Orders
            .Join(context.Tables,
                order => order.TableId,
                table => table.Id,
                (order, table) => new { order, table })
            .Join(context.Rooms,
                combined => combined.table.RoomId,
                room => room.Id,
                (combined, room) => new { combined.order, room })
            .Join(context.Floors,
                combined => combined.room.FloorId,
                floor => floor.Id,
                (combined, floor) => new { combined.order, combined.room, floor })
            .AnyAsync(f => f.floor.Id == id);

        if (orderExists)
            return new ApiResponse { Code = "0", Message = "No se puede eliminar ya existen ordenes registradas!" };

        context.Remove(floor);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminado correctamente!" };
    }

    public async Task<ApiResponse> GetAllAsync()
    {
        var floors = await context.Floors.Include(x => x.Rooms).Where(x => x.Deleted == null).ToListAsync();
        return floors.Count > 0
            ? new ApiResponse { Code = "1", Payload = floors }
            : new ApiResponse { Code = "0", Message = "Not found!" };
    }

    public async Task<ApiResponse> GetByEstabAsync(int establecimientoId)
    {
        var floors = await context.Floors.Include(x => x.Rooms)
               .ThenInclude(r => r.Tables)
            .Where(x => x.EstablecimientoId == establecimientoId && x.Deleted == null).ToListAsync();
        return floors.Count > 0
            ? new ApiResponse { Code = "1", Payload = floors }
            : new ApiResponse { Code = "0", Message = "Not found!" };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Floor floor)
    {
        var floorFound = await context.Floors.FindAsync(id);
        if (floorFound == null) return new ApiResponse { Code = "0", Message = "Floor not found" };

        floorFound.Capacity = floor.Capacity;
        floorFound.Code = floor.Code;
        floorFound.Description = floor.Description;
        floorFound.IsActive = floor.IsActive;
        floorFound.UserId = floor.UserId;
        context.Update(floorFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado correctamente!" };
    }

    private bool FloorExistsCodeEstab(string code, string codEstab)
    {
        return context.Floors.Any(e => e.Code == code && e.CodEstab == codEstab);
    }
}
