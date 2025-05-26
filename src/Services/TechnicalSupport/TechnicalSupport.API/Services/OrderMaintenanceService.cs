namespace TechnicalSupport.API.Services;

public class OrderMaintenanceService : IOrderMaintenanceService
{
    private readonly IAdoRepository _adoRepository;
    private readonly TechnicalSupportContext _context;

    public OrderMaintenanceService(TechnicalSupportContext context, IAdoRepository adoRepository)
    {
        _context = context;
        _adoRepository = adoRepository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _adoRepository.GetDataSetAsync("TechnicalSupport.OrderMantenaince_Get", parameters);

        if (DataValidation.DataSetIsNull(ds, true))
            return new ApiResponse { Code = "0", Message = "No se encontraron datos" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        // Assuming _adoRepository.SPExecuteAsync throws specific exceptions related to stored procedure execution
        return await _adoRepository.SpExecuteAsync<ApiResponse>("TechnicalSupport.OrderMantenaince_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        // Assuming _adoRepository.SPExecuteAsync throws specific exceptions related to stored procedure execution
        return await _adoRepository.SpExecuteAsync<ApiResponse>("TechnicalSupport.OrderMantenaince_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var orderMaintenance = await _context.OrderMaintenances.FindAsync(id);

        if (orderMaintenance == null)
            // Handle case where order not found
            return new ApiResponse { Code = "0", Message = "No se encontró orden para eliminar" };

        orderMaintenance.IsActive = false;
        orderMaintenance.IsDeleted = true;

        _context.Update(orderMaintenance);
        await _context.SaveChangesAsync();

        return new ApiResponse { Code = "1", Message = "Eliminado exitosamente" };
    }
}