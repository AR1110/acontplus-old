using Acontplus.Core.Domain.Common.Results;
using Restaurant.Application.DTOs.MealManagement;
using Restaurant.Application.Interfaces.MealManagement;

namespace Restaurant.Application.Services.MealManagement;

public class MealConsumptionService : IMealConsumptionService
{
    public Task<Result<MealConsumptionResponse, DomainError>> AddAsync(CreateMealConsumptionRequest request) => throw new NotImplementedException();
    public Task<Result<bool, DomainError>> DeleteAsync(int id) => throw new NotImplementedException();
    public Task<Result<IReadOnlyList<PagedResult<MealConsumptionResponse>>, DomainError>> GetAsync(PaginationDto paginationDto) => throw new NotImplementedException();
    public Task<Result<MealConsumptionResponse, DomainError>> UpdateAsync(int id, UpdateMealConsumptionRequest request) => throw new NotImplementedException();
}

