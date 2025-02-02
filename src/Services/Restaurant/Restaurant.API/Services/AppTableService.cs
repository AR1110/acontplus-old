using Common.Core.Models;
using Microsoft.EntityFrameworkCore;
using Restaurant.API.Data;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services;

public class AppTableService(RestaurantContext context) : IAppTableService
{
    public async Task<ApiResponse> GetByEstabAsync(string codEstab)
    {
        var rooms = await context.Rooms.Include(x => x.Floor)
            .Where(x => x.Floor.CodEstab == codEstab && x.Deleted == null)
            .ToListAsync();
        var floors = await context.Floors
            .Where(x => x.CodEstab == codEstab && x.Deleted == null)
            .ToListAsync();

        var tables = await context.Tables
            .Include(x => x.Room)
            .Where(x => x.Room.Floor.CodEstab == codEstab && x.Deleted == null)
            .ToListAsync();

        var result = new Dictionary<string, object> { { "rooms", rooms }, { "floors", floors }, { "tables", tables } };
        return new ApiResponse { Code = "1", Payload = result };
        // var ds = await adoRepository.GetDataSetAsync("Restaurant.Tables_Get", parameters);
        //
        // return DataValidation.DataSetIsNull(ds, true)
        //     ? new ApiResponse { Code = "0", Message = "Data not found" }
        //     : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(AppTable appTable)
    {
        context.Tables.Add(appTable);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrada existosamente" };
        // var parameters = new Dictionary<string, object>
        // {
        //     { "userRoleId", request.UserRoleId }, { "json", DataConverters.SerializeDictionary(request.Data) }
        // };
        // return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.Table_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(int id, AppTable appTable)
    {
        var tableFound = await context.Tables.FindAsync(id);

        if (tableFound == null) return new ApiResponse { Code = "1", Message = "No se encontro mesa" };
        ;

        tableFound.UserId = appTable.UserId;
        tableFound.RoomId = appTable.RoomId;
        tableFound.Description = appTable.Description;
        tableFound.NumberTable = appTable.NumberTable;
        tableFound.Enabled = appTable.Enabled;
        tableFound.Capacity = appTable.Capacity;
        tableFound.Assigned = appTable.Assigned;
        context.Update(tableFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizada existosamente" };
        // var parameters = new Dictionary<string, object>
        // {
        //     { "userRoleId", request.UserRoleId },
        //     { "id", id },
        //     { "json", DataConverters.SerializeDictionary(request.Data) }
        // };
        // return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.Table_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var appTable = await context.Tables.FindAsync(id);
        if (appTable == null)
        {
            return new ApiResponse { Code = "0", Message = "Ingredient not found" };
        }
        //var orderExists = await context.Orders
        //           .Join(context.Tables,
        //                 order => order.TableId,
        //                 table => table.Id,
        //                 (order, table) => new { order, table })
        //           .AnyAsync(t => t.table.Id == id);

        //if (orderExists)
        //{
        //    return new ApiResponse { Code = "0", Message = "No se puede eliminar ya existen ordenes registradas!" };
        //}
        appTable.Enabled = false;
        context.Update(appTable);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Inactivado existosamente" };
    }

    public async Task<ApiResponse> UnassignAsync(int userId, int id)
    {
        var tableFound = await context.Tables.FindAsync(id);

        if (tableFound == null) return new ApiResponse { Code = "1", Message = "No se encontro mesa" };
        ;

        tableFound.UserId = userId;
        tableFound.Assigned = null;
        context.Update(tableFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Desasignada existosamente" };
    }
}
