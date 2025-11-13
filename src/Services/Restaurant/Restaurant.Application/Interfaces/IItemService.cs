using Restaurant.Application.Dtos.Items;

namespace Restaurant.Application.Interfaces;

public interface IItemService
{
    Task<Result<PagedResult<ItemItem>, DomainError>> GetAsync(PaginationRequest paginationRequest);
    Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
