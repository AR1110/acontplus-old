namespace TechnicalSupport.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly TechnicalSupportContext _context;
        private readonly IADORepository _repository;
        private readonly string _module = "TechnicalSupport.Order_";

        public OrderService(TechnicalSupportContext context, IADORepository repository)
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
            return new ApiResponse { code = "1", message = "Entregada correctamente" };
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync($"{_module}Get", parameters);
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
            return await _repository.SPExecuteAsync($"{_module}Insert", parameters);
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync($"{_module}Update", parameters);
        }

        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync($"{_module}Delete", parameters);
        }
    }
}
