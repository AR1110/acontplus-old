using Acontplus.Core.Domain.Common.Results;
using Restaurant.Application.DTOs.MealManagement;
using Restaurant.Application.Interfaces.MealManagement;

namespace Restaurant.Application.Services.MealManagement;

public class MealScheduleSettingService : IMealScheduleSettingService
{
    public Task<Result<MealScheduleSettingResponse, DomainError>> AddAsync(CreateMealScheduleSettingRequest request, CancellationToken cancellationToken = default) => throw new NotImplementedException();
    public Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default) => throw new NotImplementedException();
    public Task<Result<IReadOnlyList<MealScheduleSettingResponse>, DomainError>> GetAsync(int EstablishmentId, CancellationToken cancellationToken = default) => throw new NotImplementedException();
    public Task<Result<MealScheduleSettingResponse, DomainError>> UpdateAsync(int id, UpdateMealScheduleSettingRequest request, CancellationToken cancellationToken = default) => throw new NotImplementedException();
}

