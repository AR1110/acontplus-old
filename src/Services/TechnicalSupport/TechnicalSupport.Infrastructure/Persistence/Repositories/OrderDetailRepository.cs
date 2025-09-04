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

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{_module}_Insert", parameters);
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        if (await _context.OrderMaintenances.AnyAsync(x => x.OrderDetailId == id && !x.IsDeleted))
            return new SpResponse
            {
                Code = "0",
                Message = "No se puede eliminar, este equipo ya tiene mantenimientos en curso"
            };

        var detailFound = await _context.OrderDetails.FindAsync(id);

        _context.Remove(detailFound);
        await _context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException();
    }

    public async Task<SpResponse> UpdateAsync(int id, Dictionary<string, object> parameters)
    {
        return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{_module}_Update", parameters);
    }
}
