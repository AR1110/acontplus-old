using Restaurant.Application.Dtos.Items;

namespace Restaurant.Application.Interfaces;

public interface IPromotionService
{
    Task<Result<PagedResult<ItemResponse>, DomainError>> GetAsync(PaginationRequest paginationRequest);
    Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
