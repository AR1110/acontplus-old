namespace TechnicalSupport.Infrastructure.Persistence.Repositories;

public class OrderRepository : IOrderRepository
{
  private readonly IAdoRepository _adoRepository;
  private readonly TechnicalSupportContext _context;
  private readonly string _module = "TechnicalSupport.Order_";

  public OrderRepository(TechnicalSupportContext context, IAdoRepository adoRepository)
  {
    _context = context;
    _adoRepository = adoRepository;
  }

  public async Task<SpResponse> DeliveryAsync(OrderDeliveryDto deliveryDto, int id)
  {
    var statuses = await _context.OrderStatuses.AsNoTracking().Where(x => x.Code == "E").ToListAsync();
    var orderFound = await _context.Orders.FindAsync(id);
    orderFound.OrderStatusId = statuses.FirstOrDefault().Id;
    orderFound.CreatedByUserId = deliveryDto.UserId;

    // Verification for update
    if (deliveryDto.IsOtherReceiver)
    {
      orderFound.ReceiverGovernmentId = deliveryDto.ReceiverGovernmentId;
      orderFound.Receiver = deliveryDto.Receiver;
    }

    _context.Update(orderFound);
    await _context.SaveChangesAsync();
    return new SpResponse { Code = "1", Message = "Entregada correctamente" };
  }

  public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
  {
    var ds = await _adoRepository.GetDataSetAsync($"{_module}Get", parameters);
    return DataValidation.DataSetIsNull(ds, true)
        ? new SpResponse { Code = "0", Message = "No se encontraron datos" }
        : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
  }

  public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{_module}Insert", parameters);
  }

  public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{_module}Update", parameters);
  }

  public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{_module}Delete", parameters);
  }
}
