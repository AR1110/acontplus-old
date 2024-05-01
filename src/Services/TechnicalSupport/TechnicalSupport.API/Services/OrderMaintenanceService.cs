public class OrderMaintenanceService : IOrderMaintenanceService
{
    private readonly TechnicalSupportContext _context;
    private readonly IADORepository _repository;

    public OrderMaintenanceService(TechnicalSupportContext context, IADORepository repository)
    {
        _context = context;
        _repository = repository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("TechnicalSupport.OrderMantenaince_Get", parameters);

        if (DataValidation.DataSetIsNull(ds, true))
        {
            return new ApiResponse { code = "0", message = "No se encontraron datos" };
        }
        else
        {
            return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
        }
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        // Assuming _repository.SPExecuteAsync throws specific exceptions related to stored procedure execution
        return await _repository.SPExecuteAsync("TechnicalSupport.OrderMantenaince_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        // Assuming _repository.SPExecuteAsync throws specific exceptions related to stored procedure execution
        return await _repository.SPExecuteAsync("TechnicalSupport.OrderMantenaince_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
        {
            // Handle case where order not found
            return new ApiResponse { code = "0", message = "No se encontró orden para eliminar" };
        }

        order.Enabled = false;
        order.Deleted = true;

        _context.Orders.Update(order);
        await _context.SaveChangesAsync();

        return new ApiResponse { code = "1", message = "Eliminado exitosamente" };
    }
}
