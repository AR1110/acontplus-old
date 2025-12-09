namespace Restaurant.Application.Interfaces.MealManagement;

public interface IMealPlanService
{
    Task<Result<MealPlanItem, DomainError>> AddAsync(MealPlanCreate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<MealPlanItem>, DomainError>> GetAsync(int EstablishmentId,
        CancellationToken cancellationToken = default);

    Task<Result<MealPlanItem, DomainError>> UpdateAsync(int id, MealPlanUpdate request,
        CancellationToken cancellationToken = default);
}
