using TechnicalSupport.Core.Entities;

namespace TechnicalSupport.Core.Interfaces
{
    public interface IOrderService
    {
        Task<string> AddAsync(Order order);
    }
}
