using Acontplus.Core.Domain.Common.Results;
using Restaurant.Application.DTOs.MealManagement;

namespace Restaurant.Application.Interfaces.MealManagement;

public interface IMealPlanService
{
    Task<Result<MealPlanResponse, DomainError>> AddAsync(CreateMealPlanRequest request);
    Task<Result<bool, DomainError>> DeleteAsync(int id);
    Task<Result<IReadOnlyList<MealPlanResponse>, DomainError>> GetAsync(int EstablishmentId);
    Task<Result<MealPlanResponse, DomainError>> UpdateAsync(int id, UpdateMealPlanRequest request);
}

