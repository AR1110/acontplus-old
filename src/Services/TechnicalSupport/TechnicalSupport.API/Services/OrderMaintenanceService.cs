public class OrderMaintenanceService : IOrderMaintenanceService
{
    private readonly TechnicalSupportContext _context;
    private readonly IAdoRepository _repository;

    public OrderMaintenanceService(TechnicalSupportContext context, IAdoRepository repository)
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

        return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        // Assuming _repository.SPExecuteAsync throws specific exceptions related to stored procedure execution
        return await _repository.SpExecuteAsync("TechnicalSupport.OrderMantenaince_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        // Assuming _repository.SPExecuteAsync throws specific exceptions related to stored procedure execution
        return await _repository.SpExecuteAsync("TechnicalSupport.OrderMantenaince_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var orderMaintenance = await _context.OrderMaintenances.FindAsync(id);

        if (orderMaintenance == null)
        {
            // Handle case where order not found
            return new ApiResponse { code = "0", message = "No se encontró orden para eliminar" };
        }

        orderMaintenance.Enabled = false;
        orderMaintenance.Deleted = true;

        _context.Update(orderMaintenance);
        await _context.SaveChangesAsync();

        return new ApiResponse { code = "1", message = "Eliminado exitosamente" };
    }
}
