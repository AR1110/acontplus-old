namespace Restaurant.Application.Interfaces.MealManagement;

public interface IMealConsumptionService
{
    Task<Result<MealConsumptionItem, DomainError>> AddAsync(MealConsumptionCreate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<PagedResult<MealConsumptionItem>, DomainError>> GetAsync(PaginationRequest paginationRequest,
        CancellationToken cancellationToken = default);

    Task<Result<PagedResult<CustomerMealConsumptionItem>, DomainError>> SearchCustomerAsync(
        PaginationRequest paginationRequest,
        CancellationToken cancellationToken = default);

    Task<Result<MealConsumptionItem, DomainError>> UpdateAsync(int id, MealConsumptionUpdate request,
        CancellationToken cancellationToken = default);
}
