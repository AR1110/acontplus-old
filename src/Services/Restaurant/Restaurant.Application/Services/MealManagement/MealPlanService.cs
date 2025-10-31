using Acontplus.Core.Domain.Common.Results;
using Restaurant.Application.DTOs.MealManagement;
using Restaurant.Application.Interfaces.MealManagement;

namespace Restaurant.Application.Services.MealManagement;

public class MealPlanService : IMealPlanService
{
    public Task<Result<MealPlanResponse, DomainError>> AddAsync(CreateMealPlanRequest request) => throw new NotImplementedException();
    public Task<Result<bool, DomainError>> DeleteAsync(int id) => throw new NotImplementedException();
    public Task<Result<IReadOnlyList<MealPlanResponse>, DomainError>> GetAsync(int EstablishmentId) => throw new NotImplementedException();
    public Task<Result<MealPlanResponse, DomainError>> UpdateAsync(int id, UpdateMealPlanRequest request) => throw new NotImplementedException();
}

