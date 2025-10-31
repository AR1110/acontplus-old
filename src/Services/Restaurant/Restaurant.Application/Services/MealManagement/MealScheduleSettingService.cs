using Acontplus.Core.Domain.Common.Results;
using Restaurant.Application.DTOs.MealManagement;
using Restaurant.Application.Interfaces.MealManagement;

namespace Restaurant.Application.Services.MealManagement;

public class MealScheduleSettingService : IMealScheduleSettingService
{
    public Task<Result<MealScheduleSettingResponse, DomainError>> AddAsync(CreateMealScheduleSettingRequest request) => throw new NotImplementedException();
    public Task<Result<bool, DomainError>> DeleteAsync(int id) => throw new NotImplementedException();
    public Task<Result<IReadOnlyList<MealScheduleSettingResponse>, DomainError>> GetAsync(int EstablishmentId) => throw new NotImplementedException();
    public Task<Result<MealScheduleSettingResponse, DomainError>> UpdateAsync(int id, UpdateMealScheduleSettingRequest request) => throw new NotImplementedException();
}

