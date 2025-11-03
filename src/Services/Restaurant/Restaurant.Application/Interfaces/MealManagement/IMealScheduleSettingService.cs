using Acontplus.Core.Domain.Common.Results;
using Restaurant.Application.DTOs.MealManagement;

namespace Restaurant.Application.Interfaces.MealManagement;

public interface IMealScheduleSettingService
{
    Task<Result<MealScheduleSettingResponse, DomainError>> AddAsync(CreateMealScheduleSettingRequest request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<MealScheduleSettingResponse>, DomainError>> GetAsync(int EstablishmentId, CancellationToken cancellationToken = default);
    Task<Result<MealScheduleSettingResponse, DomainError>> UpdateAsync(int id, UpdateMealScheduleSettingRequest request, CancellationToken cancellationToken = default);
}
