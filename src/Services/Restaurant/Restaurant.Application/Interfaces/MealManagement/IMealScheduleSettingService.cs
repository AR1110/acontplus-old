namespace Restaurant.Application.Interfaces.MealManagement;

public interface IMealScheduleSettingService
{
    Task<Result<MealScheduleSettingItem, DomainError>> AddAsync(MealScheduleSettingCreate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<MealScheduleSettingItem>, DomainError>> GetAsync(int EstablishmentId,
        CancellationToken cancellationToken = default);

    Task<Result<MealScheduleSettingItem, DomainError>> UpdateAsync(int id, MealScheduleSettingUpdate request,
        CancellationToken cancellationToken = default);
}
