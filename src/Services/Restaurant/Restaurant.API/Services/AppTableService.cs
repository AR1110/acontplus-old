using Common.Core.Models;
using Common.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Restaurant.API.Data;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services;

public class AppTableService(IAdoRepository adoRepository, RestaurantContext context) : IAppTableService
{
    public async Task<ApiResponse> GetAsync(string codEstab)
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
        var tableFounded = await context.Tables.FindAsync(id);

        if (tableFounded == null) return new ApiResponse { Code = "1", Message = "No se encontro mesa" };
        ;

        tableFounded.UserId = appTable.UserId;
        tableFounded.RoomId = appTable.RoomId;
        tableFounded.Description = appTable.Description;
        tableFounded.NumberTable = appTable.NumberTable;
        tableFounded.Enabled = appTable.Enabled;
        tableFounded.Capacity = appTable.Capacity;
        tableFounded.Assigned = appTable.Assigned;
        context.Update(tableFounded);
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

        appTable.Enabled = false;
        appTable.Deleted = true;
        appTable.UserId = userId;
        context.Update(appTable);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada existosamente" };
        // var parameters = new Dictionary<string, object> { { "userRoleId", request.UserRoleId }, { "id", id } };
        // return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.Table_Delete", request.Data);
    }
}
