namespace Restaurant.Infrastructure.Persistence.Repositories;

public class AppTableRepository(RestaurantContext context) : IAppTableRepository
{
    public async Task<SpResponse> GetByEstabAsync(string codEstab)
    {
        var rooms = await context.Rooms.AsNoTracking().Include(x => x.Floor)
            .Where(x => x.Floor.CodEstab == codEstab && !x.IsDeleted)
            .ToListAsync();
        var floors = await context.Floors
            .AsNoTracking()
            .Where(x => x.CodEstab == codEstab && !x.IsDeleted)
            .ToListAsync();

        var tables = await context.Tables
            .AsNoTracking()
            .Include(x => x.Room)
            .Where(x => x.Room.Floor.CodEstab == codEstab && !x.IsDeleted)
            .ToListAsync();

        var result = new Dictionary<string, object> { { "rooms", rooms }, { "floors", floors }, { "tables", tables } };
        return new SpResponse { Code = "1", Payload = result };
        // var ds = await adoRepository.GetDataSetAsync("Restaurant.Tables_Get", parameters);
        //
        // return DataValidation.DataSetIsNull(ds, true)
        //     ? new SpResponse { Code = "0", Message = "Data not found" }
        //     : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(AppTable appTable)
    {
        context.Tables.Add(appTable);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrada existosamente" };
        // var parameters = new Dictionary<string, object>
        // {
        //     { "userRoleId", request.UserRoleId }, { "json", DataConverters.SerializeDictionary(request.Data) }
        // };
        // return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Table_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(int id, AppTable appTable)
    {
        var tableFound = await context.Tables.FindAsync(id);

        if (tableFound == null) return new SpResponse { Code = "1", Message = "No se encontro mesa" };

        tableFound.UpdatedByUserId = appTable.UpdatedByUserId;
        tableFound.RoomId = appTable.RoomId;
        tableFound.Description = appTable.Description;
        tableFound.NumberTable = appTable.NumberTable;
        tableFound.IsActive = appTable.IsActive;
        tableFound.Capacity = appTable.Capacity;
        tableFound.Assigned = appTable.Assigned;
        context.Update(tableFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizada existosamente" };
        // var parameters = new Dictionary<string, object>
        // {
        //     { "userRoleId", request.UserRoleId },
        //     { "id", id },
        //     { "json", DataConverters.SerializeDictionary(request.Data) }
        // };
        // return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Table_Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var appTable = await context.Tables.FindAsync(id);
        if (appTable == null) return new SpResponse { Code = "0", Message = "Ingredient not found" };
        //var orderExists = await context.Orders
        //           .Join(context.Tables,
        //                 order => order.TableId,
        //                 table => table.Id,
        //                 (order, table) => new { order, table })
        //           .AnyAsync(t => t.table.Id == id);

        //if (orderExists)
        //{
        //    return new SpResponse { Code = "0", Message = "No se puede eliminar ya existen ordenes registradas!" };
        //}
        appTable.MarkAsDeleted(userId);
        context.Update(appTable);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Inactivado existosamente" };
    }

    public async Task<SpResponse> UnassignAsync(int userId, int id)
    {
        var tableFound = await context.Tables.FindAsync(id);

        if (tableFound == null) return new SpResponse { Code = "1", Message = "No se encontro mesa" };
        ;

        tableFound.UpdatedByUserId = userId;
        tableFound.Assigned = null;
        context.Update(tableFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Desasignada existosamente" };
    }
}
