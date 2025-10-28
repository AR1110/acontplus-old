namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class OrderMaintenanceRepository : IOrderMaintenanceRepository
{
    private readonly IAdoRepository _adoRepository;
    private readonly TechnicalSupportContext _context;

    public OrderMaintenanceRepository(TechnicalSupportContext context, IAdoRepository adoRepository)
    {
        _context = context;
        _adoRepository = adoRepository;
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _adoRepository.GetDataSetAsync("TechnicalSupport.OrderMantenaince_Get", parameters);

        if (DataValidation.DataSetIsNull(ds, true))
            return new SpResponse { Code = "0", Message = "No se encontraron datos" };

        return new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        // Assuming _adoRepository.QuerySingleOrDefaultAsync throws specific exceptions related to stored procedure execution
        return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>("TechnicalSupport.OrderMantenaince_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        // Assuming _adoRepository.QuerySingleOrDefaultAsync throws specific exceptions related to stored procedure execution
        return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>("TechnicalSupport.OrderMantenaince_Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(int id)
    {
        var orderMaintenance = await _context.OrderMaintenances.FindAsync(id);

        if (orderMaintenance == null)
            // Handle case where order not found
            return new SpResponse { Code = "0", Message = "No se encontró orden para eliminar" };

        _context.Remove(orderMaintenance);
        await _context.SaveChangesAsync();

        return new SpResponse { Code = "1", Message = "Eliminado exitosamente" };
    }
}
