using Acontplus.Core.Domain.Common.Results;
using Restaurant.Application.DTOs.MealManagement;

namespace Restaurant.Application.Interfaces.MealManagement;

public interface IMealPlanService
{
    Task<Result<MealPlanResponse, DomainError>> AddAsync(CreateMealPlanRequest request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<MealPlanResponse>, DomainError>> GetAsync(int EstablishmentId, CancellationToken cancellationToken = default);
    Task<Result<MealPlanResponse, DomainError>> UpdateAsync(int id, UpdateMealPlanRequest request, CancellationToken cancellationToken = default);
}

