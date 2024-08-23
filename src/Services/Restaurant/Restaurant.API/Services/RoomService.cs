using Common.Core.Models;
using Microsoft.EntityFrameworkCore;
using Restaurant.API.Data;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services;

public class RoomService(RestaurantContext context) : IRoomService
{
    public async Task<ApiResponse> AddAsync(Room room)
    {
        var roomExists = RoomExists(room.FloorId, room.Code);
        if (roomExists) return new ApiResponse { Code = "0", Message = "El código ya está en uso" };
        context.Rooms.Add(room);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrado correctamente!" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var room = await context.Rooms.FindAsync(id);
        if (room == null)
        {
            return new ApiResponse { Code = "0", Message = "Floor not found" };
        }

        room.Enabled = false;
        room.Deleted = true;
        room.UserId = userId;
        context.Update(room);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminado correctamente!" };
    }

    public async Task<ApiResponse> GetAllAsync()
    {
        var floors = await context.Rooms.Include(x => x.Floor).Where(x => x.Deleted == null).ToListAsync();
        return floors.Count > 0
            ? new ApiResponse { Code = "1", Payload = floors }
            : new ApiResponse { Code = "0", Message = "Not found!" };
    }

    public async Task<ApiResponse> GetByEstabAsync(string codEstab)
    {
        var rooms = await context.Rooms.Include(x => x.Floor)
            .Where(x => x.Floor.CodEstab == codEstab && x.Deleted == null)
            .ToListAsync();
        return rooms.Count > 0
            ? new ApiResponse { Code = "1", Payload = rooms }
            : new ApiResponse { Code = "0", Message = "Not found!" };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Room room)
    {
        var roomFound = await context.Floors.FindAsync(id);
        if (roomFound == null)
        {
            return new ApiResponse { Code = "0", Message = "Floor not found" };
        }

        roomFound.Code = room.Code;
        roomFound.Description = room.Description;
        roomFound.Enabled = room.Enabled;
        roomFound.UserId = room.UserId;
        context.Update(roomFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado correctamente!" };
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
