using Microsoft.EntityFrameworkCore;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Repositories;

namespace Restaurant.Infrastructure.Persistence.Repositories;

public class OrderDetailRepository(RestaurantContext context) : IOrderDetailRepository
{
  public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
  {
    return new SpResponse { Code = "1", Message = "Success" };
  }

  public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
  {
    return new SpResponse { Code = "1", Message = "Added successfully" };
  }

  public async Task<SpResponse> PutAsync(Dictionary<string, object> parameters)
  {
    return new SpResponse { Code = "1", Message = "Updated successfully" };
  }

  public async Task<SpResponse> DeleteAsync(int userId, int id)
  {
    var orderDetail = await context.OrderDetails.FindAsync(id);
    if (orderDetail == null) return new SpResponse { Code = "0", Message = "OrderDetail not found" };

    orderDetail.IsDeleted = true;
    orderDetail.UpdatedByUserId = userId;
    context.Update(orderDetail);
    await context.SaveChangesAsync();
    return new SpResponse { Code = "1", Message = "Eliminado exitosamente!" };
  }

  public async Task<IEnumerable<OrderDetail>> GetByOrderIdAsync(int orderId)
  {
    return await context.OrderDetails
        .AsNoTracking()
        .Where(od => od.OrderId == orderId)
        .Include(od => od.Item)
        .Include(od => od.Modifiers)
        .ToListAsync();
  }

  public async Task<IEnumerable<OrderDetail>> GetByStatusAsync(OrderDetailStatus status)
  {
    return await context.OrderDetails
        .AsNoTracking()
        .Where(od => od.Status == status)
        .Include(od => od.Order)
        .Include(od => od.Item)
        .ToListAsync();
  }

  public async Task<IEnumerable<OrderDetail>> GetPendingByOrderIdAsync(int orderId)
  {
    return await context.OrderDetails
        .AsNoTracking()
        .Where(od => od.OrderId == orderId && od.Status == OrderDetailStatus.Pending)
        .Include(od => od.Item)
        .ToListAsync();
  }
}
