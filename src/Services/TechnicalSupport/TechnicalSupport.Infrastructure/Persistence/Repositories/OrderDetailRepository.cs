namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class OrderDetailRepository : IOrderDetailRepository
{
    private readonly IAdoRepository _adoRepository;
    private readonly TechnicalSupportContext _context;
    private readonly string _module = "TechnicalSupport.OrderDetail";

    public OrderDetailRepository(IAdoRepository adoRepository, TechnicalSupportContext context)
    {
        _adoRepository = adoRepository;
        _context = context;
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _adoRepository.SpExecuteAsync<ApiResponse>($"{_module}_Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        if (await _context.OrderMaintenances.AnyAsync(x => x.OrderDetailId == id && !x.IsDeleted))
            return new ApiResponse
            {
                Code = "0",
                Message = "No se puede eliminar, este equipo ya tiene mantenimientos en curso"
            };

        var detailFound = await _context.OrderDetails.FindAsync(id);

        _context.Remove(detailFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException();
    }

    public async Task<ApiResponse> UpdateAsync(int id, Dictionary<string, object> parameters)
    {
        return await _adoRepository.SpExecuteAsync<ApiResponse>($"{_module}_Update", parameters);
    }
}
