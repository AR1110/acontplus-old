namespace TechnicalSupport.API.Services;

public class OrderService : IOrderService
{
    private readonly TechnicalSupportContext _context;
    private readonly string _module = "TechnicalSupport.Order_";
    private readonly IAdoRepository _repository;

    public OrderService(TechnicalSupportContext context, IAdoRepository repository)
    {
        _context = context;
        _repository = repository;
    }

    public async Task<ApiResponse> DeliveryAsync(OrderDeliveryDto deliveryDto, int id)
    {
        var statuses = await _context.OrderStatuses.Where(x => x.Code == "E").ToListAsync();
        var orderFound = await _context.Orders.FindAsync(id);
        orderFound.OrderStatusId = statuses.FirstOrDefault().Id;
        orderFound.UserId = deliveryDto.UserId;

        // Verification for update
        if (deliveryDto.IsOtherReceiver)
        {
            orderFound.ReceiverGovernmentId = deliveryDto.ReceiverGovernmentId;
            orderFound.Receiver = deliveryDto.Receiver;
        }

        _context.Update(orderFound);
        await _context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Entregada correctamente" };
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{_module}Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true))
        {
            return new ApiResponse { Code = "0", Message = "No se encontraron datos" };
        }

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{_module}Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{_module}Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{_module}Delete", parameters);
    }
}
