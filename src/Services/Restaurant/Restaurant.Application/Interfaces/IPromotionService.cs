using Restaurant.Application.Dtos.Promotions;

namespace Restaurant.Application.Interfaces;

public interface IPromotionService
{
    Task<Result<PagedResult<PromotionItem>, DomainError>> GetAsync(PaginationRequest paginationRequest);
    Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
