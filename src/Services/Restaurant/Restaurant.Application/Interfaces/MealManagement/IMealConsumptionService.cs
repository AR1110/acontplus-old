using Acontplus.Core.Domain.Common.Results;
using Restaurant.Application.DTOs.MealManagement;

namespace Restaurant.Application.Interfaces.MealManagement;
public interface IMealConsumptionService
{
    Task<Result<MealConsumptionResponse, DomainError>> AddAsync(CreateMealConsumptionRequest request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<PagedResult<MealConsumptionResponse>>, DomainError>> GetAsync(PaginationDto paginationDto, CancellationToken cancellationToken = default);
    Task<Result<MealConsumptionResponse, DomainError>> UpdateAsync(int id, UpdateMealConsumptionRequest request, CancellationToken cancellationToken = default);
}

