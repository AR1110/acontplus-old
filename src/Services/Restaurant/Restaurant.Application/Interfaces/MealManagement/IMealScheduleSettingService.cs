using Acontplus.Core.Domain.Common.Results;
using Restaurant.Application.DTOs.MealManagement;

namespace Restaurant.Application.Interfaces.MealManagement;

public interface IMealScheduleSettingService
{
    Task<Result<MealScheduleSettingResponse, DomainError>> AddAsync(CreateMealScheduleSettingRequest request);
    Task<Result<bool, DomainError>> DeleteAsync(int id);
    Task<Result<IReadOnlyList<MealScheduleSettingResponse>, DomainError>> GetAsync(int EstablishmentId);
    Task<Result<MealScheduleSettingResponse, DomainError>> UpdateAsync(int id, UpdateMealScheduleSettingRequest request);
}
